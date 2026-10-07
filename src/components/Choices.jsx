export function RadioGroup({ legend, name, value, options, onChange }) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choices">
        {options.map((option) => (
          <label
            className={`choice ${value === option ? "selected" : ""}`}
            key={option}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="choice-mark" aria-hidden="true" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function CheckboxGroup({ legend, value, options, onChange }) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choices drinks-choices">
        {options.map((option) => (
          <label
            className={`choice ${value.includes(option) ? "selected" : ""}`}
            key={option}
          >
            <input
              type="checkbox"
              value={option}
              checked={value.includes(option)}
              onChange={() =>
                onChange(
                  value.includes(option)
                    ? value.filter((v) => v !== option)
                    : [...value, option],
                )
              }
            />
            <span className="choice-mark square" aria-hidden="true" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
