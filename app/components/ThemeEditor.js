import * as React from "react";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { defaultTheme, getIdb } from "../util";

function CustomThemeDialog(props) {
  const [primColor, setPrimColor] = useState(props.theme.palette.primary.main);
  const [secColor, setSecColor] = useState(props.theme.palette.secondary.main);
  const [darkMode, setDarkMode] = useState(props.theme.palette.mode === "dark");
  if (!props.open) return null;

  const handleClose = () => props.setOpen(false);
  const handlePrimColorChange = e => setPrimColor(e.target.value);
  const handleSecColorChange = e => setSecColor(e.target.value);
  const handleDarkModeChange = e => setDarkMode(e.target.checked);

  const handleApply = () => {
    const theme = {
      primary: { main: primColor },
      secondary: { main: secColor },
      mode: darkMode ? "dark" : "light"
    };
    getIdb()
      .then(db => db.put("settings", { id: "defaultTheme", theme }))
      .then(() => {
        props.setTheme(createMuiTheme({ palette: theme }));
        props.setOpen(false);
      });
  };

  const handleReset = () => {
    setPrimColor(defaultTheme.primary.main);
    setSecColor(defaultTheme.secondary.main);
    setDarkMode(defaultTheme.mode === "dark");
    getIdb()
      .then(db => db.delete("settings", "defaultTheme"))
      .then(() => {
        props.setTheme(createMuiTheme({ palette: defaultTheme }));
        props.setOpen(false);
      });
  };

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Customize theme colors</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            size="small"
            label="primary color"
            type="color"
            value={primColor}
            onChange={handlePrimColorChange}
            fullWidth
          />
          <TextField
            variant="outlined"
            size="small"
            label="secondary color"
            type="color"
            value={secColor}
            onChange={handleSecColorChange}
            style={{ marginLeft: 12 }}
            fullWidth
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox checked={darkMode} onChange={handleDarkModeChange} />
          }
          label="enable dark mode colors"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} variant="contained" color="secondary">
          Reset to default theme
        </Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          Apply theme colors
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(CustomThemeDialog);
