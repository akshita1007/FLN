import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Box, Tooltip, Typography } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import img_pdf from '../../Assets/pdf.png';
import img_excel from '../../Assets/xls.png';
import { base64Font } from "./Base64Font";
import { useAuth } from "../../context/AuthContext";

function TableMaterialGet({ URL, body={}, column_tab, table_name, apiBody, apiCount, hidden_col = "" }) {
  const [dataTable, setDataTable] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState(hidden_col);
  const {token} = useAuth();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = () => {
    try {
      const cancelToken = axios.CancelToken.source();
      setIsLoading(true);
      setIsRefetching(true);
      axios.get(URL,
        {
          
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params:{...body,...(searchQuery && {searchKey:searchQuery}),page:pagination.pageIndex + 1},
          cancelToken: cancelToken.token
        }
      )
        .then((response) => {
          if (response.data?.success) {
            setDataTable(response.data?.[apiBody] || []);
            setRowCount(response.data?.[apiCount] || 0);
          } else {
            setDataTable([]);
            setRowCount(0);
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("Request Cancelled");
          } else {
            console.error("Error fetching data:", error);
          }
        });
    } catch (e) {
      setIsError(true);
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [body, pagination.pageIndex, pagination.pageSize, sorting, searchQuery, columnFilters]);

  useEffect(() => {
    setColumnVisibility(hidden_col);
  }, [hidden_col]);

  const columns = useMemo(() => {
    return column_tab;
  }, [column_tab]);

  const fetchAllData = async () => {
    let allData = [];
    let pageIndex = 0;
    const pageSize = 100; // Fetch 100 records at a time
    let totalPages = 1;
    try {
      setIsLoading(true);
      while (pageIndex < totalPages) {
        const response = await axios.post(URL, {
          page: pageIndex + 1,
          limit: pageSize,
          ...body,
          sortField: sorting[0],
          search: searchQuery,
          filters: columnFilters,
        },{
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
        if (response.data?.success) {
          allData = [...allData, ...(response.data?.[apiBody] || [])];
          if (pageIndex === 0) {
            totalPages = Math.ceil((response.data?.[apiCount] || 0) / pageSize);
          }
        } else {
          break;
        }
        pageIndex++;
      }
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setIsLoading(false);
    }
    return allData;
  };

  const handleExportRows = async (rows, cols, selectedRows) => {
    const exportData = selectedRows.length > 0 ? selectedRows : await fetchAllData();
    const exportColumns = cols.map(col => col.header);

    const sheetData = exportData.map(row => {
      const rowData = {};
      cols.forEach(col => {
        rowData[col.header] = row.getValue ? row.getValue(col.accessorKey) : row[col.accessorKey];
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(sheetData, { header: exportColumns });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet");

    XLSX.writeFile(wb, `${table_name}.xlsx`);
  };

  const handleExportPDF = async (rows, cols, selectedRows) => {
    const exportData = selectedRows.length > 0 ? selectedRows : await fetchAllData();
    const exportColumns = cols.map(col => col.header);

    const doc = new jsPDF('landscape');
    const title = "FLN";
    const subtitle = table_name;
    const date = new Date();
    const dateText = `Report Date: ${date.toLocaleDateString()}`;
    const timeText = `Time: ${date.toLocaleTimeString()}`;

    doc.setFontSize(10).setFont("helvetica", "bold")
      .text(title, doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' })
      .setFont("normal")
      .text(subtitle, doc.internal.pageSize.getWidth() / 2, 16, { align: 'center' }).setFont("Italic")
      .text(dateText, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' })
      .text(timeText, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' })
      .line(10, 34, doc.internal.pageSize.getWidth() - 10, 34);

    doc.addFileToVFS('Hindi.ttf', base64Font);
    doc.addFont('Hindi.ttf', "Hindi", "normal");
    doc.setFont("Hindi");
    const tableRows = exportData.map(row => {
      return cols.map(col => row.getValue ? row.getValue(col.accessorKey) : row[col.accessorKey]);
    });

    doc.autoTable({
      head: [exportColumns],
      body: tableRows,
      startY: 37,
      styles: { font: "Hindi", fontSize: 8 },
      theme: 'striped',
    });

    doc.save(`${table_name}.pdf`);
  };

  const [tableKey, setTableKey] = useState(0); // State to manage table key

  const handleRefreshTable = () => {
    setTableKey(prevKey => prevKey + 1);
  };

  const table = useMaterialReactTable({
    columns,
    data: dataTable,
    enableRowSelection: true,
  });

  useEffect(() => {
    table.setRowSelection({});
  }, [dataTable, table]);

  return (
    <Box sx={{ background:'#949494ff', padding:'1px' }}>
      <MaterialReactTable
        key={tableKey}
        table={table}

      />
    </Box>
  );
}

export default TableMaterialGet;
