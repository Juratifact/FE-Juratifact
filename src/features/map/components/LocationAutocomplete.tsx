import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useAutocomplete } from "../hooks/useMap";
import { cn } from "@/lib/utils";

interface LocationAutocompleteProps {
  value: string;
  onChange: (address: string, refId?: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Debounce input value for API call
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data: suggestions, isLoading } = useAutocomplete(debouncedValue);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (address: string, refId: string) => {
    setInputValue(address);
    onChange(address, refId);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            onChange(e.target.value); // refId will be undefined here
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10 rounded-xl"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
      </div>

      {isOpen && suggestions && suggestions.length > 0 && (
        <div className="absolute z-[60] mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <ul className="max-h-[300px] overflow-y-auto py-1">
            {suggestions.map((item) => (
              <li
                key={item.ref_id}
                onClick={() => handleSelect(item.address, item.ref_id)}
                className="group flex cursor-pointer items-start gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold leading-tight">{item.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {item.address}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
