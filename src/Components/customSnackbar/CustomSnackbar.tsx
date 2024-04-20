import React, { useContext, useState } from "react";

import Snackbar from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { AlertContext } from "../../Util/context";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  let [bgColor] = useState(() => {
    switch (props.severity) {
      case "error":
        return "#cc2424";
      case "success":
        return "#11898d";
      case "warning":
        return "#bfab3b";
      default:
        break;
    }
  });
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props} // sx must come after the props to override the background color to bgColor
      sx={{
        backgroundColor: bgColor,
      }}
    />
  );
});

// this componenent lives on the highest parent in the render tree 'App'
const CustomSnackbar = () => {
  const { alert, setAlert } = useContext(AlertContext);

  function handleClose() {
    setAlert({ message: "", severity: undefined });
  }

  return (
    <div className="mb-10">
      <Snackbar
        open={alert && alert?.message !== ""}
        TransitionComponent={SlideTransition}
        autoHideDuration={4000}
        onClose={handleClose}
        key={alert?.message}
      >
        <Alert
          onClose={handleClose}
          severity={alert?.severity}
          sx={{ width: "100%" }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomSnackbar;
