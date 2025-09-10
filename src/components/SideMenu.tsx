import { NavLink } from "react-router-dom";

export function SideMenu({ routes }: { routes: any }) {
  const renderMenu = (items: any) => {
    return items.hideInMenu ? null :(
    <ul className="menu">
      {items.map((item: any) => (
        <li key={item.path}>
          {item.children ? (
            <>
              <div className="menu-title">{item.meta.title}</div>
              <ul>{renderMenu(item.children)}</ul>
            </>
          ) : (
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.meta.title}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  )
  };

  return renderMenu(routes);
}
