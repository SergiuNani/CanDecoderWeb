import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  memo,
  useMemo,
} from "react";
import { Box, Typography, useTheme, Dialog } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  whatPDOisObject,
  whatObjectValueMeans,
} from "../functions/CANopenFunctions";
import { addSpacesOfTwo } from "../functions/NumberConversion";
import {
  verifyValidityOfMappingGroup,
  verifyRepetitiveGroup,
} from "../functions/CANopen";
import { tokens } from "../theme";
import {
  TooltipClickable,
  Button4,
  Checkbox_Component,
} from "./SmallComponents";
import {
  filteredMessages_auxGlobal,
  DecodedTableOptionsContext,
  Decode_CAN_LOG_WindowContext,
} from "../scenes/Decode_CAN_LOG";
import { RegisterTooltip } from "./Register";
export let groupedFilteredArray = [];

export const TableROW = ({ iteration, ProtocolGlobal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  var isRecieveTypeMessage = [
    "R_SDO",
    "RPDO1",
    "RPDO2",
    "RPDO3",
    "RPDO4",
    "NMT",
    "GiveData",
    "GiveData2",
  ].includes(iteration.type);
  return (
    <table
      style={{
        width: "100%",
        position: "relative",
        color: `${colors.grey[100]}`,
        background: `${colors.blue[300]}`,
        fontFamily: "Calibri",
        fontSize: "0.9rem",
        tableLayout: "fixed",
      }}
    >
      <thead>
        <tr
          style={{
            borderBottom: `1px solid ${colors.grey[300]}`,
            background: isRecieveTypeMessage
              ? `${colors.blue[200]}`
              : "inherit",
            borderLeft: isRecieveTypeMessage
              ? `0.3rem solid ${colors.primary[400]}`
              : `0.3rem solid transparent`,
          }}
        >
          <td
            style={{
              textAlign: "center",
              padding: "0.3rem 0",
              width: "2.5rem",
            }}
            className="msgNrClass"
          >
            {iteration.msgNr}
          </td>
          <td
            style={{
              textAlign: "center",
              cursor: "pointer",
              width: "10rem",
            }}
          >
            <TooltipClickable
              title={iteration.OriginalMessage}
              arrow
              placement="top"
            >
              {ProtocolGlobal == "RS232" ? (
                <p>{addSpacesOfTwo(iteration.FrameData)}</p>
              ) : (
                <p>
                  {iteration.CobID} - {addSpacesOfTwo(iteration.FrameData)}
                </p>
              )}
            </TooltipClickable>
          </td>
          <td
            style={{
              textAlign: "center",
              color: `${colors.blue[500]}`,
              fontWeight: "600",
              width: "4rem",
            }}
          >
            {iteration.type}
          </td>
          <td
            style={{
              textAlign: "center",
              color: `${colors.personal[100]}`,
              fontWeight: "700",
              width: ProtocolGlobal == "RS232" ? "3rem" : "2rem",
            }}
          >
            {iteration.AxisID}
          </td>
          <td
            style={{
              textAlign: "center",
              width: ProtocolGlobal == "RS232" ? "5rem" : "2rem",
            }}
          >
            {iteration.CS}
          </td>
          <td
            style={{
              textAlign: "center",
              color: `${colors.yellow[100]}`,
              fontWeight: "600",
              width: ProtocolGlobal == "RS232" ? "3rem" : "8rem",
            }}
          >
            {iteration.Object}
          </td>
          {ProtocolGlobal == "RS232" ? null : (
            <td
              style={{
                textAlign: "center",
                overflowY: "auto",
                width: "11rem",
              }}
            >
              {iteration.ObjectName}
            </td>
          )}
          <td
            style={{
              textAlign: "center",
              color: `${colors.green[100]}`,
              fontWeight: "700",
              width: ProtocolGlobal == "RS232" ? "11rem" : "7rem",
            }}
          >
            {ProtocolGlobal != "RS232" ? (
              <RegisterTooltip
                objects={iteration.Object}
                objectData={iteration.Data}
              >
                {iteration.Data}
              </RegisterTooltip>
            ) : (
              <p>{iteration.Data}</p>
            )}
          </td>
          <td
            style={{
              textAlign: "center",
              width: "25rem",
              minWidth: "15rem",
              overflowY: "auto",
              fontWeight:
                iteration.errorStatus == "error"
                  ? "700"
                  : iteration.errorStatus == "blue"
                  ? "700"
                  : "inherit",
              color:
                iteration.errorStatus == "error"
                  ? `${colors.red[500]}`
                  : iteration.errorStatus == "warning"
                  ? `${colors.yellow[500]}`
                  : iteration.errorStatus == "random"
                  ? `${colors.green[100]}`
                  : iteration.errorStatus == "blue"
                  ? `${colors.personal[300]}`
                  : "inherit",
            }}
          >
            {iteration.Interpretation}
          </td>
        </tr>
      </thead>
    </table>
  );
};

export const TableROW_simple = ({ obj, timeInfo, type }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  var isRecieveTypeMessage = 0;
  if (obj.type) {
    isRecieveTypeMessage = [
      "R_SDO",
      "RPDO1",
      "RPDO2",
      "RPDO3",
      "RPDO4",
      "NMT",
      "GiveData",
      "GiveData2",
    ].includes(obj.type);
  }
  const TypeFinder = () => {
    return (
      <>
        <p
          style={{
            color: colors.primary[600],
            minWidth: "2rem",
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          {obj.msgNr}{" "}
        </p>
        <p
          style={{ color: colors.primary[400], minWidth: "4rem" }}
        >{`[${obj.AxisID}]`}</p>
        <p
          style={{
            color: colors.blue[600],
            minWidth: "11rem",
            fontWeight: "400",
          }}
        >
          {obj.CobID} - {obj.FrameData}
        </p>
        <p
          style={{ color: colors.yellow[300], minWidth: "12rem" }}
        >{`${obj.Object}`}</p>
        <p
          style={{ color: colors.personal[100], minWidth: "10rem" }}
        >{`${obj.Data}`}</p>
        <p
          style={{
            color:
              obj.errorStatus === "error"
                ? colors.red[600]
                : colors.yellow[100],
          }}
        >
          {obj.Interpretation}
        </p>
      </>
    );
  };

  const TypeTime = () => {
    const [showTimeDiff, setShowTimeDiff] = useState(false);
    const [textObject, setTextObject] = useState({
      firstMsgsNr: "",
      secondMsgsNr: "",
      firstValue: 0,
      secondValue: 0,
      diff_ms: 0,
      diff_us: 0,
      diff_s: 0,
      diff_m: 0,
      diff_h: 0,
    });
    function handleCheckboxChange(e) {
      if (e.target.checked) {
        var allLinesSelected = document.querySelectorAll(".LineSelected");
        if (allLinesSelected.length > 1) {
          allLinesSelected.forEach((el) => {
            el.classList.remove("LineSelected");
            el.querySelector("label input").checked = false;
          });
        } else if (allLinesSelected.length == 1) {
          // we have two checks
          var foundCheckboxNr = parseInt(
            allLinesSelected[0].children[1].innerText
          );
          var foundCheckboxValue = parseFloat(
            allLinesSelected[0].children[2].innerText.split(" ")[0]
          );
          var currentCheckboxNr = parseInt(
            e.target.closest("div").children[1].innerText
          );
          var currentCheckboxValue = parseFloat(
            e.target.closest("div").children[2].innerText.split(" ")[0]
          );
          var firstTime =
            currentCheckboxNr > foundCheckboxNr
              ? foundCheckboxValue
              : currentCheckboxValue;
          var lastTime =
            currentCheckboxNr > foundCheckboxNr
              ? currentCheckboxValue
              : foundCheckboxValue;
          var diff = (lastTime - firstTime).toFixed(3);

          setTextObject({
            firstMsgsNr: "",
            secondMsgsNr: "",
            firstValue: firstTime,
            secondValue: lastTime,
            diff_ms: diff,
            diff_us: diff * 1000,
            diff_s: diff / 1000,
            diff_m: diff / 1000 / 60,
            diff_h: diff / 1000 / 3600,
          });
          setShowTimeDiff(true);
        }
        e.target.closest("div").classList.add("LineSelected");
      } else {
        e.target.closest("div").classList.remove("LineSelected");
      }
    }
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <label>
          <input
            type="checkbox"
            name="checkbox"
            onChange={handleCheckboxChange}
          />
        </label>
        <p
          style={{
            color: isRecieveTypeMessage
              ? colors.primary[400]
              : colors.primary[600],
            minWidth: "2rem",
            textAlign: "center",
          }}
        >
          {obj.msgNr}{" "}
        </p>
        <TooltipClickable
          title={
            <div>
              <p>{obj.OriginalMessage}</p>
              <p style={{ color: `${colors.primary[400]}` }}>
                {" "}
                {`Extracted: ${timeInfo[2]} => ${timeInfo[3]}`}
              </p>
            </div>
          }
          arrow
          placement="top"
        >
          <p
            style={{
              color: colors.green[100],
              minWidth: "8rem",
              textAlign: "center",
              cursor: "pointer",
              fontWeight: "400",
            }}
          >
            {timeInfo[0] != "-" ? `${timeInfo[0]} ms` : "-"}
          </p>
        </TooltipClickable>
        <p
          style={{
            color: colors.yellow[100],
            minWidth: "8rem",
            textAlign: "center",
          }}
        >
          {timeInfo[1] != "-" ? `${timeInfo[1]} ms` : "-"}
        </p>
        <p
          style={{ color: colors.primary[400], minWidth: "4rem" }}
        >{`[${obj.AxisID}]`}</p>
        <p
          style={{
            color: colors.blue[600],
            minWidth: "11rem",
            fontWeight: "400",
          }}
        >
          {obj.CobID} - {obj.FrameData}
        </p>
        <p
          style={{ color: colors.yellow[300], minWidth: "12rem" }}
        >{`${obj.Object}`}</p>
        <p
          style={{ color: colors.personal[100], minWidth: "10rem" }}
        >{`${obj.Data}`}</p>
        <p
          style={{
            color:
              obj.errorStatus === "error"
                ? colors.red[600]
                : colors.yellow[100],
          }}
        >
          {obj.Interpretation}
        </p>

        <Dialog
          open={showTimeDiff}
          onClose={() => setShowTimeDiff(false)}
          sx={{
            "& .MuiDialog-paper": {
              maxWidth: "none",
            },
            width: "100%",
            height: "100vh",
          }}
        >
          <div
            style={{
              border: `2px solid ${colors.yellow[500]}`,
              background: `${colors.primary[200]}`,
              padding: "1rem",
              fontSize: "1.2rem",
            }}
          >
            <p
              style={{
                fontSize: "2rem",
                color: `${colors.primary[400]}`,
              }}
            >
              {textObject.secondValue} - {textObject.firstValue} ={" "}
              {textObject.diff_ms} ms{" "}
            </p>
            <br />
            <p>{textObject.diff_us} us</p>
            <p>{textObject.diff_s} sec</p>
            <p>{textObject.diff_m} min</p>
            <p>{textObject.diff_h} hours</p>
          </div>
        </Dialog>
      </div>
    );
  };
  const TypeExtraction = () => {
    return (
      <div style={{ fontSize: "0.9rem" }}>
        <div style={{ display: "flex", marginTop: "0.4rem" }}>
          <p
            style={{
              minWidth: "4rem",
              color: `${colors.grey[200]}`,
            }}
          >
            {obj[0]}
          </p>
          <TooltipClickable
            title={
              <div>
                <p>{obj[4].join(" - ")}</p>
              </div>
            }
            arrow
            placement="top"
          >
            <p
              style={{
                minWidth: "17rem",
                fontWeight: "400",
                color: `${colors.primary[600]}`,
                cursor: "pointer",
              }}
            >
              {obj[1]}
            </p>
          </TooltipClickable>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            margin: "0.5rem 0 0.5rem 7rem",
          }}
        >
          <p style={{ color: `${colors.green[400]}` }}>[{obj[2]}]</p>
          <p style={{ color: `${colors.yellow[500]}` }}>[{obj[3]}]</p>
        </div>
      </div>
    );
  };

  const TypeCANReal = () => {
    function handleCheckboxChange(e) {
      if (e.target.checked) {
        e.target.closest("div").classList.add("IncludeLine");
      } else {
        e.target.closest("div").classList.remove("IncludeLine");
      }
    }

    return (
      <div
        className="IncludeLine"
        style={{ display: "flex", margin: "0.2rem" }}
      >
        <label>
          <input
            type="checkbox"
            name="checkbox"
            onChange={handleCheckboxChange}
            defaultChecked
          />
        </label>

        <p
          style={{
            color: colors.primary[600],
            minWidth: "2rem",
            textAlign: "center",
            fontWeight: "400",
          }}
        >
          {obj.msgNr}{" "}
        </p>
        <p
          style={{ color: colors.primary[400], minWidth: "4rem" }}
        >{`[${obj.AxisID}]`}</p>
        <p
          style={{
            color: colors.blue[600],
            minWidth: "11rem",
            fontWeight: "400",
          }}
          className="cobID_CANreal"
        >
          {obj.CobID} - {obj.FrameData}
        </p>

        <p
          style={{ color: colors.yellow[300], minWidth: "12rem" }}
          className="obj_CANreal"
        >{`${obj.Object}`}</p>
        <p
          style={{ color: colors.personal[100], minWidth: "10rem" }}
          className="obj_value_CANreal"
        >{`${obj.Data}`}</p>
        <p
          style={{
            color:
              obj.errorStatus === "error"
                ? colors.red[600]
                : colors.yellow[100],
          }}
          className="interp_CANreal"
        >
          {obj.Interpretation}
        </p>
      </div>
    );
  };

  return (
    <section
      style={{
        display: "flex",
        width: "100%",
        fontWeight: "550",
        borderBottom: `1px solid ${colors.grey[400]}`,
        padding: "0.2rem",
        borderLeft: isRecieveTypeMessage
          ? `3px solid ${colors.primary[400]}`
          : `3px solid transparent`,
      }}
    >
      {type == "Finder" ? (
        <TypeFinder />
      ) : type == "Time" ? (
        <TypeTime />
      ) : type == "Extraction" ? (
        <TypeExtraction />
      ) : type == "CANReal" ? (
        <TypeCANReal />
      ) : null}
    </section>
  );
};
const TableRowGroup = ({
  groupTitle,
  groupSubTitle,
  groupData,
  errorStatus,
  ProtocolGlobal,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const groupType = groupData[0].GroupType;
  function handleClick(e) {
    if (
      e.target.closest(".GroupHeader").parentElement.querySelector(".GroupBody")
        .style.display == "none"
    ) {
      e.target
        .closest(".GroupHeader")
        .parentElement.querySelector(".GroupBody").style.display = "block";
      e.target
        .closest(".GroupHeader")
        .querySelector(".IconExpand").style.transform = "rotate(180deg)";
      e.target.closest(
        ".GroupHeader"
      ).style.background = `${colors.personal[200]}`;
    } else {
      e.target
        .closest(".GroupHeader")
        .parentElement.querySelector(".GroupBody").style.display = "none";
      e.target
        .closest(".GroupHeader")
        .querySelector(".IconExpand").style.transform = "rotate(0deg)";
      e.target.closest(
        ".GroupHeader"
      ).style.background = `${colors.primary[300]}`;
    }
  }

  return (
    <section>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          transition: "all 0.3s ease-in-out",
          padding: "0.5rem",
          cursor: "pointer",
          userSelect: "none",
          width: "50%",
          background: `${colors.primary[300]}`,
          margin: "0.5rem  0 ",
          borderRadius: "0.5rem",
        }}
        onClick={handleClick}
        className="GroupHeader"
      >
        <p
          style={{
            fontSize: "1.2rem",
            textAlign: "center",
            justifySelf: "center",
            color:
              groupType == "Repetitive"
                ? colors.personal[100]
                : groupType == "Mapping"
                ? colors.yellow[500]
                : colors.blue[500],
          }}
        >
          {groupTitle}
        </p>
        <p
          style={{
            marginLeft: "1rem",
            fontSize: "0.9rem",
            color:
              errorStatus == "error"
                ? colors.red[500]
                : errorStatus == "warning"
                ? colors.grey[200]
                : colors.green[500],
          }}
        >
          - {groupSubTitle}
        </p>
        <p className="IconExpand" style={{ marginLeft: "auto" }}>
          <ExpandMoreIcon />
        </p>
      </div>
      {/* GROUP BODY*/}
      <div
        style={{
          padding: "0px",
          borderBottom: `3px solid ${colors.personal[100]}`,
          display: "none",
        }}
        className="GroupBody"
      >
        <div>
          {groupData.slice(1).map((iteration, index) => {
            return (
              <TableROW
                key={index}
                iteration={iteration}
                ProtocolGlobal={ProtocolGlobal}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
export function CreateGroupedFilteredArray(
  allMessages,
  GroupingOptionsForMessages,
  setProgressBar,
  ProtocolGlobal
) {
  groupedFilteredArray = [];

  allMessages.forEach((oneMessage, index) => {
    //GROUPING-------------------------------------------------
    var lastElementFromSortedArray =
      groupedFilteredArray[groupedFilteredArray.length - 1];
    var isLastElementArray = Array.isArray(lastElementFromSortedArray);

    if (GroupingOptionsForMessages.Mapping && ProtocolGlobal != "RS232") {
      var isObjectRelatedToMapping = whatPDOisObject(oneMessage.Object);

      if (isObjectRelatedToMapping && oneMessage.type.slice(2) == "SDO") {
        if (
          isLastElementArray &&
          lastElementFromSortedArray[0].GroupType == "Mapping" &&
          lastElementFromSortedArray[0].AxisID == oneMessage.AxisID &&
          lastElementFromSortedArray[0].GroupIndicator ==
            isObjectRelatedToMapping
        ) {
          // Same Group Type, AxisID, and Group Indicator
          return groupedFilteredArray[groupedFilteredArray.length - 1].push(
            oneMessage
          );
        } else {
          // Different Group Type, AxisID, or Group Indicator
          groupedFilteredArray.push([
            {
              GroupType: "Mapping",
              AxisID: oneMessage.AxisID,
              GroupIndicator: isObjectRelatedToMapping,
            },
          ]);
          return groupedFilteredArray[groupedFilteredArray.length - 1].push(
            oneMessage
          );
        }
      }
    }
    if (GroupingOptionsForMessages.Modes && ProtocolGlobal != "RS232") {
      var objects = oneMessage.Object.split(" / ").indexOf("#x6060");
      var ObjectValue = oneMessage.Data.split(" / ")[objects];
      if (
        objects != -1 &&
        oneMessage.errorStatus != "error" &&
        ((oneMessage.type == "R_SDO" && oneMessage.CS.slice(0, 1) == "2") ||
          oneMessage.type.slice(0, 4) == "RPDO")
      ) {
        if (
          isLastElementArray &&
          lastElementFromSortedArray[0].GroupType == "Modes" &&
          lastElementFromSortedArray[0].AxisID == oneMessage.AxisID &&
          lastElementFromSortedArray[0].GroupIndicator == ObjectValue
        ) {
          //Last Element is an array
          return groupedFilteredArray[groupedFilteredArray.length - 1].push(
            oneMessage
          );
        } else {
          groupedFilteredArray.push([
            {
              GroupType: "Modes",
              AxisID: oneMessage.AxisID,
              GroupIndicator: ObjectValue,
            },
          ]);
          return groupedFilteredArray[groupedFilteredArray.length - 1].push(
            oneMessage
          );
        }
      } else {
        //The remaining messages will try to fit into a group
        if (
          isLastElementArray &&
          lastElementFromSortedArray[0].GroupType == "Modes" &&
          lastElementFromSortedArray[0].AxisID == oneMessage.AxisID
        ) {
          return groupedFilteredArray[groupedFilteredArray.length - 1].push(
            oneMessage
          );
        }
      }
    }
    if (GroupingOptionsForMessages.Repetitive) {
      var spamElementsArray = ["NMT_M", "SYNC", "-", "invalid"];
      if (spamElementsArray.includes(oneMessage.type)) {
        if (isLastElementArray) {
          //Not done
          if (
            lastElementFromSortedArray[0].GroupType == "Repetitive" &&
            lastElementFromSortedArray[0].CobID == "Repetitive"
          ) {
            return groupedFilteredArray[groupedFilteredArray.length - 1].push(
              oneMessage
            );
          } else {
            //Create new group
            var Next5ElemQualify = true;
            for (let i = index + 1; i < index + 5; i++) {
              if (
                !allMessages[i] ||
                !spamElementsArray.includes(allMessages[i].type)
              ) {
                Next5ElemQualify = false;
              }
            }
            if (Next5ElemQualify) {
              groupedFilteredArray.push([
                {
                  GroupType: "Repetitive",
                  CobID: "Repetitive",
                },
              ]);
              return groupedFilteredArray[groupedFilteredArray.length - 1].push(
                oneMessage
              );
            }
          }
        } else {
          //Create new group
          var Next5ElemQualify = true;
          for (let i = index + 1; i < index + 5; i++) {
            if (
              !allMessages[i] ||
              !spamElementsArray.includes(allMessages[i].type)
            ) {
              Next5ElemQualify = false;
            }
          }
          if (Next5ElemQualify) {
            groupedFilteredArray.push([
              {
                GroupType: "Repetitive",
                CobID: "Repetitive",
              },
            ]);
            return groupedFilteredArray[groupedFilteredArray.length - 1].push(
              oneMessage
            );
          }
        }
      } else {
        // If we have identical messages we will group em together
        if (isLastElementArray) {
          if (
            lastElementFromSortedArray[0].GroupType == "Repetitive" &&
            lastElementFromSortedArray[0].CobID == oneMessage.CobID &&
            lastElementFromSortedArray[0].FrameData == oneMessage.FrameData
          ) {
            return groupedFilteredArray[groupedFilteredArray.length - 1].push(
              oneMessage
            );
          } else {
            var Next10ElemQualify = true;
            for (let i = index + 1; i < index + 10; i++) {
              if (
                !allMessages[i] ||
                oneMessage.CobID != allMessages[i].CobID ||
                oneMessage.FrameData != allMessages[i].FrameData
              ) {
                Next10ElemQualify = false;
              }
            }
            if (Next10ElemQualify) {
              groupedFilteredArray.push([
                {
                  GroupType: "Repetitive",
                  CobID: oneMessage.CobID,
                  FrameData: oneMessage.FrameData,
                },
              ]);
              return groupedFilteredArray[groupedFilteredArray.length - 1].push(
                oneMessage
              );
            }
          }
        } else {
          var Next10ElemQualify = true;
          for (let i = index + 1; i < index + 10; i++) {
            if (
              !allMessages[i] ||
              oneMessage.CobID != allMessages[i].CobID ||
              oneMessage.FrameData != allMessages[i].FrameData
            ) {
              Next10ElemQualify = false;
            }
          }
          if (Next10ElemQualify) {
            groupedFilteredArray.push([
              {
                GroupType: "Repetitive",
                CobID: oneMessage.CobID,
                FrameData: oneMessage.FrameData,
              },
            ]);
            return groupedFilteredArray[groupedFilteredArray.length - 1].push(
              oneMessage
            );
          }
        }
      }
    }

    //Simply add the object to the array--------------------
    groupedFilteredArray.push(oneMessage);
    // var procent = (oneMessage.msgNr / allMessages.length) * 100
  });
  setProgressBar(false);
}

//-------------------ALL TYPES OF TABLE-------------------
export const DefaultTable = ({ ProtocolGlobal }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  var {
    LogDisplayRange,
    LogDisplayRange_Inf,
    LogDisplayRange_Sup,
    FilteredLogLenght,
  } = useContext(DecodedTableOptionsContext);
  var { setShortcutToDecodeMessages, shortcutToDecodeMessages_whoCalled } =
    useContext(Decode_CAN_LOG_WindowContext);

  function LoadPrevMessagesButton() {
    function handleLoadPrev() {
      LogDisplayRange_Inf.current = aux_inf;
      LogDisplayRange_Sup.current = aux_sup;
      shortcutToDecodeMessages_whoCalled.current = "NextPrevMsgsButtons";
      setShortcutToDecodeMessages((prev) => !prev);
    }
    var aux_sup = null;
    var aux_inf = null;
    var text = "";
    if (LogDisplayRange_Inf.current > 0) {
      //There are still messages to load backwards

      if (
        LogDisplayRange_Sup.current - LogDisplayRange_Inf.current <
        LogDisplayRange.current
      ) {
        aux_inf = LogDisplayRange_Inf.current - LogDisplayRange.current;
        aux_sup = LogDisplayRange_Inf.current;
      } else {
        aux_inf = LogDisplayRange_Inf.current - LogDisplayRange.current;
        aux_sup = LogDisplayRange_Sup.current - LogDisplayRange.current;
      }
    }
    if (
      aux_sup &&
      aux_inf != null &&
      filteredMessages_auxGlobal[aux_inf] &&
      filteredMessages_auxGlobal[aux_sup]
    ) {
      text = `Load previous ${LogDisplayRange.current} frames:  [Range: ${
        filteredMessages_auxGlobal[aux_inf].msgNr
      } to ${filteredMessages_auxGlobal[aux_sup - 1].msgNr}] [Total: ${
        FilteredLogLenght.current
      }]`;
    }

    return aux_sup ? (
      <div style={{ textAlign: "center" }}>
        <Button4 onClick={handleLoadPrev}>{text}</Button4>
      </div>
    ) : null;
  }
  const LoadNextMessagesButton = () => {
    function handleLoadNext() {
      LogDisplayRange_Inf.current = aux_inf - 1;
      LogDisplayRange_Sup.current = aux_sup;
      shortcutToDecodeMessages_whoCalled.current = "NextPrevMsgsButtons";
      setShortcutToDecodeMessages((prev) => !prev);
    }
    var aux_sup = null;
    var aux_inf = null;
    var text;
    if (FilteredLogLenght.current - LogDisplayRange_Sup.current > 0) {
      //There are still messages to display next
      if (
        FilteredLogLenght.current -
          LogDisplayRange_Sup.current -
          LogDisplayRange.current >
        0
      ) {
        //we can display an enitre range of messages
        aux_inf = LogDisplayRange_Sup.current + 1;
        aux_sup = LogDisplayRange_Sup.current + LogDisplayRange.current;
      } else if (
        FilteredLogLenght.current -
          LogDisplayRange_Sup.current -
          LogDisplayRange.current <=
        0
      ) {
        //we can display only a part of the range
        aux_inf = LogDisplayRange_Sup.current + 1;
        aux_sup = FilteredLogLenght.current;
      }
    }
    if (
      aux_sup &&
      aux_inf &&
      filteredMessages_auxGlobal[aux_inf - 1] &&
      filteredMessages_auxGlobal[aux_sup - 1]
    ) {
      text = `Load next ${LogDisplayRange.current} frames: [Range: ${
        filteredMessages_auxGlobal[aux_inf - 1].msgNr
      } to ${filteredMessages_auxGlobal[aux_sup - 1].msgNr}] [Total: ${
        FilteredLogLenght.current
      }]`;
    }

    return aux_inf ? (
      <div style={{ textAlign: "center" }}>
        <Button4 onClick={handleLoadNext}>{text}</Button4>
      </div>
    ) : null;
  };

  const Table_Memo = useMemo(() => {
    return (
      <Box
        style={{
          position: "relative",
          marginBottom: "20rem",
          width: "99.5%",
        }}
      >
        <LoadPrevMessagesButton />

        <table
          style={{
            width: "100%",
            fontWeight: "700",
            position: "sticky",
            top: "3rem",
            background: `${colors.primary[300]}`,
            zIndex: 1,
            fontSize: "1rem",
            tableLayout: "fixed",
          }}
        >
          <thead>
            {/* Table ROW FOR THEAD---------------------------- */}
            <tr>
              <th
                style={{
                  padding: "0.5rem",
                  width: "2.5rem",
                }}
              >
                NR
              </th>
              <th style={{ width: "10rem" }}>Original Message</th>
              <th style={{ width: "4rem" }}>Type</th>
              <th
                style={{ width: ProtocolGlobal == "RS232" ? "3rem" : "2rem" }}
              >
                {ProtocolGlobal == "RS232" ? "Destination" : "ID"}
              </th>
              <th
                style={{ width: ProtocolGlobal == "RS232" ? "5rem" : "2rem" }}
              >
                {ProtocolGlobal == "RS232" ? "Op" : "CS"}
              </th>
              <th
                style={{ width: ProtocolGlobal == "RS232" ? "3rem" : "8rem" }}
              >
                {ProtocolGlobal == "RS232" ? "Sender" : "Object"}
              </th>
              {ProtocolGlobal == "RS232" ? null : (
                <th style={{ width: "11rem" }}>Object Name</th>
              )}
              <th
                style={{ width: ProtocolGlobal == "RS232" ? "11rem" : "7rem" }}
              >
                {ProtocolGlobal == "RS232" ? "TML Command" : "Data"}
              </th>
              <th style={{ width: "25rem" }}>Interpretation</th>
            </tr>
          </thead>
        </table>

        {groupedFilteredArray.map((group, index) => {
          //-------------------Main Grouping Process-------------------
          var groupisArray = Array.isArray(group);
          if (groupisArray) {
            let title = "";
            let subtitle = "";
            let errorStatus = "";
            if (group[0].GroupType == "Mapping") {
              var temp = verifyValidityOfMappingGroup(group);
              title = group[0].GroupIndicator.concat(` - ${temp[1]}`);
              subtitle = temp[0].concat(
                " - " + `${group.length - 1}` + "msg(s)"
              );
              errorStatus = temp[2];
            } else if (group[0].GroupType == "Modes") {
              title = whatObjectValueMeans(
                "6060",
                group[0].GroupIndicator,
                8,
                "ignoreType",
                "ignoreAxis"
              )[0];
              subtitle = `AxisID: ${group[0].AxisID},  0x6060h = 0x${
                group[0].GroupIndicator
              }, ${group.length - 1}msg(s)`;
            } else {
              //Repetitive
              title = "Repetitive";
              subtitle = verifyRepetitiveGroup(group);
            }
            return (
              <TableRowGroup
                key={index}
                groupTitle={title}
                groupSubTitle={subtitle}
                groupData={group}
                errorStatus={errorStatus}
                ProtocolGlobal={ProtocolGlobal}
              />
            );
          } else {
            return (
              <TableROW
                key={index}
                iteration={group}
                ProtocolGlobal={ProtocolGlobal}
              />
            );
          }
        })}

        <LoadNextMessagesButton />
      </Box>
    );
  }, []);

  return <section>{Table_Memo}</section>;
};
