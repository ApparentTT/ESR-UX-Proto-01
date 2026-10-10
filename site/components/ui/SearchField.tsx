"use client";

import { useId } from "react";
import { Icon } from "./Icon";

/** Full-width search input (news search, inventory A8 SearchField). Enter submits; X clears. */
export function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Search news and insights",
  label = "Search news and insights",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const id = useId();
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className={`relative flex h-14 items-center gap-3 rounded-control border bg-white pl-5 pr-2 transition-colors focus-within:border-[1.5px] focus-within:border-ink has-[input:focus]:outline-2 has-[input:focus]:outline-offset-2 has-[input:focus]:outline-ink has-[input:focus]:outline-solid ${value ? "border-[1.5px] border-ink" : "border-line"}`}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon name="search" size={22} className={value ? "text-ink" : "text-muted"} />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field h-full min-w-0 flex-1 bg-transparent text-[16px] leading-[1.45] text-ink placeholder:text-muted focus:outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            onSubmit("");
          }}
          className="inline-flex size-10 items-center justify-center rounded-btn text-muted hover:text-ink"
        >
          <Icon name="close" size={20} />
        </button>
      )}
    </form>
  );
}
