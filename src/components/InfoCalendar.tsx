import React from "react";
import type { BadgeProps, CalendarProps } from "antd";
import { Badge, Calendar, Popover } from "antd";
import type { Dayjs } from "dayjs";

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = []; // Specify the type of listData
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "警告事件..." },
        { type: "success", content: "日常事件..." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "警告事件..." },
        { type: "success", content: "日常事件..." },
        { type: "error", content: "错误事件..." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "警告事件..." },
        { type: "success", content: "已完成事件..." },
        { type: "error", content: "错误事件..." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const InfoCalendar: React.FC = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul
        className="events"
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          maxHeight: "100px", // 控制最大高度
          overflow: "hidden", // 隐藏溢出内容
        }}
      >
        {listData.map((item) => (
          <li
            key={item.content}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Popover
              content={item.content}
              trigger="hover"
              placement="topLeft"
              getPopupContainer={(triggerNode) =>
                document.getElementById("calendar-container") ||
                triggerNode.parentElement!
              }
            >
              <Badge
                status={item.type as BadgeProps["status"]}
                text={item.content}
              />
            </Popover>
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div id="calendar-container">
      <Calendar cellRender={cellRender} />
    </div>
  );
};

export default InfoCalendar;
