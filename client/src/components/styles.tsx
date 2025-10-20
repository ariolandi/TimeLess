import { PopoverOrigin, SxProps, Theme } from "@mui/material";
import { 
  primaryColor, 
  secondaryColor, 
  secondaryTextColor, 
  smallMargin, 
  smallMarginPercent, 
  standardMargin, 
  standardMarginPercent 
} from "./constants";

function makeStyles<T extends Record<string, SxProps<Theme>>>(styles: T) {
  return styles;
}

function headerBlockConstructor(width: number) {
  return {
    backgroundColor: primaryColor,
    display: "flex",
    justifyContent: "center",
    width: width,
    padding: smallMarginPercent,
  };
}

export const anchor: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

export const styles = makeStyles({
  submitButton: {
    padding: standardMargin,
    marginTop: standardMargin,
  },
  eventTile: {
    padding: standardMargin,
    marginTop: smallMargin,
    marginBottom: smallMargin
  },
  formBorder: {
    border: 1,
    borderRadius: 8,
    padding: standardMarginPercent,
    margin: standardMarginPercent,
    paddingTop: 0,
    paddingBottom: standardMarginPercent,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  menuItem: {
    backgroundColor: secondaryColor,
    color: secondaryTextColor
  },
  headerBlock: headerBlockConstructor(1),
  halfPageHeaderBlock: headerBlockConstructor(1 / 2),
});
