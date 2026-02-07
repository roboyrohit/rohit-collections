import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Enhances each navigation item with a custom template function for rendering.
 *
 * Supports optional item.activeClass and item.activeStyle to customize active link.
 */
export const createCustomItems = (items) =>
    items.map((item) => ({
        ...item,
        template: (item, options) => {
            const baseStyle = {
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                fontSize: "0.8rem",
                gap: "8px",
            };
            const defaultActiveStyle = {
                fontWeight: 600,
                color: "#0b63ff",
                backgroundColor: "rgba(11,99,255,0.06)",
                borderRadius: 4,
            };

            const navClassName = ({ isActive }) =>
                `${options?.className || ""} ${isActive ? (item.activeClass || "active-link") : ""}`.trim();

            const navStyle = ({ isActive }) =>
                isActive ? { ...baseStyle, ...(item.activeStyle || defaultActiveStyle) } : baseStyle;

            // If there's no `to`, render a plain element (no NavLink) so it never becomes "active"
            if (!item.to) {
                return (
                    <div
                        className={options?.className}
                        style={baseStyle}
                        onClick={item.onClick}
                    >
                        {typeof item.icon === "function" ? item.icon() : <span className={`pi ${item.icon}`} />}
                        <span>{item.label}</span>
                    </div>
                );
            }

            const handleClick = (e) => {
                // call item-specific click if provided
                if (typeof item.onClick === "function") item.onClick(e);

                // if user pressed ctrl/meta/shift/alt or middle mouse button -> open in new tab
                const isModified = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button === 1;
                if (isModified) {
                    e.preventDefault();
                    e.stopPropagation();
                    const toPath =
                        typeof item.to === "string" ? item.to : (item.to && item.to.pathname) || "";
                    const url = toPath.startsWith("http")
                        ? toPath
                        : window.location.origin + (toPath || "");
                    window.open(url, "_blank", "noopener,noreferrer");
                }
                // otherwise do nothing and let NavLink handle client navigation
            };

            return (
                <NavLink
                    to={item.to}
                    end={item.exact ?? true} // exact matching by default
                    className={navClassName}
                    style={navStyle}
                    onClick={handleClick}
                >
                    {typeof item.icon === "function" ? item.icon() : <span className={`pi ${item.icon}`} />}
                    <span>{item.label}</span>
                </NavLink>
            );
        },
        ...(item.items ? { items: createCustomItems(item.items) } : {}),
    }));
