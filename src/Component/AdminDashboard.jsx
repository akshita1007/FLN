import React, { useState, useEffect } from "react";
import "../Styles/AdminDashboard.css";
import { FiMenu, FiX } from "react-icons/fi";
import {FaHome, FaChartBar, FaUsers, FaClipboardList, FaSchool} from "react-icons/fa";

const Dashboard = () => {
  const [counts, setCounts] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [data, setData] = useState({
    totalSchool: 0,
    totalCaC: 0,
    totalSubmission: 0,
    visitSchoolCount: 0,
  });

  useEffect(() => {
    // CDN import for axios. This is necessary to use axios in the browser environment.
    const axiosScript = document.createElement('script');
    axiosScript.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
    axiosScript.onload = () => {
      fetchData();
    };
    document.head.appendChild(axiosScript);

    // This is the static mock JSON response provided by the user, used as a fallback.
    const staticMockData = {
      "success": true,
      "message": "Count list",
      "data": {
        "totalSchool": 30698,
        "totalCaC": 5541,
        "totalSubmission": 215,
        "visitSchoolCount": 220
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/dashboard/counts');
        console.log('API response:', response.data);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          console.error('API call was not successful. Using static data.');
          setData(staticMockData.data);
        }
      } catch (error) {
        console.error('Error fetching data from API. Using static data.');
        console.error('Error details:', error);
        setData(staticMockData.data);
      } finally {
        setLoading(false);
      }
    };

    return () => {
      // Cleanup the dynamically added script
      document.head.removeChild(axiosScript);
    };

  }, [])

  return (
    <div className="dashboard-container">
      {/* Sidebar */}

      <div className={`drawer ${isDrawerOpen ? "open" : "collapsed"}`}>
        <button
          className="toggle-btn"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          {isDrawerOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        {isDrawerOpen && (
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaHome size={30} /> Dashboard
            </li>
            <li className="flex items-center gap-2">
              <FaChartBar size={30} /> Analysis
            </li>
            <li className="flex items-center gap-2">
              <FaUsers size={30} /> CAC List
            </li>
            <li className="flex items-center gap-2">
              <FaClipboardList size={30} /> Submission
            </li>
            <li className="flex items-center gap-2">
              <FaSchool size={30} /> School Visit
            </li>
          </ul> 
   
  )
}
      </div >

  {/* Main Content */ }
  < div className = "main" >
        <h1> Hello Admin!👋</h1>
        <div className="cards">
          <div className="card">
            <h2>{data.totalSchool}</h2>
            <p>Total Schools</p>
          </div>
          <div className="card">
            <h2>{data.totalCaC}</h2>
            <p>Total CaCs</p>
          </div>
          <div className="card">
            <h2>{data.totalSubmission}</h2>
            <p>Total Submissions</p>
          </div>
          <div className="card">
            <h2>{data.visitSchoolCount}</h2>
            <p>Visit School Count</p>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Dashboard;
