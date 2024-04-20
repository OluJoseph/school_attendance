import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: "13px",
    fontFamily: "sans-serif",
  },
}));

export default CustomTooltip;
