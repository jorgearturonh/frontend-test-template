import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dropdown.css';

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

export const Dropdown = ({ value, onChange, options, label }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = value || 'All';

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-header">
        <span className="dropdown-label">{label}</span>
        <div className="dropdown-divider" />
        <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
          <span>{selectedOption}</span>
          <svg
            className={`dropdown-arrow ${isOpen ? 'dropdown-arrow-open' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="dropdown-menu"
        >
          <div className="dropdown-menu-content">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className={`dropdown-item ${
                !value ? 'dropdown-item-selected' : 'dropdown-item-not-selected'
              }`}
            >
              All
            </button>
            {options.map(option => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`dropdown-item ${
                  value === option ? 'dropdown-item-selected' : 'dropdown-item-not-selected'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
