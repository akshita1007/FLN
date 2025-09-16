import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material"

const DropdownComp = ({ disabled = false, value="", menulist, width = '100%', size = "small", getSelected, getNamed, label, default_value, id, menu_first = "All", multiMenu, id_variable = "id", name_variable = "name" }) => {  
  const onChangeValue = (e) => {
    const selectedValue = e.target.value;
    const selectedName = menulist?.find(item => item === selectedValue) ||
      multiMenu?.find(option => option[id_variable] === selectedValue)?.[name_variable];
    if (getNamed) {
      getNamed(selectedName);
    }
    getSelected(selectedValue);
  };
  return (
    <FormControl size={size} sx={{ width: width }}>
      <InputLabel id={`${id}_label`}>{label}</InputLabel>
      <Select
        disabled={disabled}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 330,
            },
          },
        }}
        default={default_value}
        labelId={`${id}_label`}
        id={id}
        value={value}
        onChange={(e) => onChangeValue(e)}
        input={<OutlinedInput label={`${label}_`} />}
        sx={{ fontSize: '0.875rem' }}
      >
        {menu_first !== "none" && <MenuItem value="">
          <em>{menu_first}</em>
        </MenuItem>}
        {menulist && menulist?.map((option, i) => (<MenuItem key={i} value={option}>{option}</MenuItem>))}
        {multiMenu && multiMenu?.map((option) => (<MenuItem key={option[id_variable]} value={option[id_variable]}>{option[name_variable]}</MenuItem>))}
      </Select>
    </FormControl>
  )
}
export default DropdownComp;