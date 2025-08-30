// @ts-nocheck
import * as React from 'react';
import {
  type CustomCell,
  type ProvideEditorCallback,
  type CustomRenderer,
  type Rectangle,
  measureTextCached,
  getMiddleCenterBias,
  useTheme,
  GridCellKind,
  roundedRect,
  getLuminance,
} from '@glideapps/glide-data-grid';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

// Core types
type SelectOption = { value: string; label?: string; color?: string };

interface MultiSelectCellProps {
  readonly kind: 'multi-select-cell';
  readonly values: string[] | undefined | null;
  readonly options?: readonly (SelectOption | string)[];
  readonly allowCreation?: boolean;
  readonly allowDuplicates?: boolean;
}

// Constants
const BUBBLE_HEIGHT = 20;
const BUBBLE_PADDING = 6;
const BUBBLE_MARGIN = 4;
const VALUE_PREFIX = '__value';
const VALUE_PREFIX_REGEX = new RegExp(`^${VALUE_PREFIX}\\d+__`);

// Helper functions
export const prepareOptions = (
  options: readonly (string | SelectOption)[]
): { value: string; label?: string; color?: string }[] => {
  return options.map((option) => {
    if (typeof option === 'string' || option === null || option === undefined) {
      return { value: option, label: option ?? '', color: undefined };
    }

    return {
      value: option.value,
      label: option.label ?? option.value ?? '',
      color: option.color ?? undefined,
    };
  });
};

export const resolveValues = (
  values: string[] | null | undefined,
  options: readonly SelectOption[],
  allowDuplicates?: boolean
): { value: string; label?: string; color?: string }[] => {
  if (values === undefined || values === null) {
    return [];
  }

  return values.map((value, index) => {
    const valuePrefix = allowDuplicates ? `${VALUE_PREFIX}${index}__` : '';
    const matchedOption = options.find((option) => option.value === value);
    if (matchedOption) {
      return {
        ...matchedOption,
        value: `${valuePrefix}${matchedOption.value}`,
      };
    }
    return { value: `${valuePrefix}${value}`, label: value };
  });
};

export type MultiSelectCell = CustomCell<MultiSelectCellProps>;

const Editor: ReturnType<ProvideEditorCallback<MultiSelectCell>> = (p) => {
  const { value: cell, initialValue, onChange, onFinishedEditing } = p;
  const { options: optionsIn, values: valuesIn, allowCreation, allowDuplicates } = cell.data;

  const theme = useTheme();
  const [value, setValue] = React.useState(valuesIn);
  const [menuOpen, setMenuOpen] = React.useState(true);
  const [inputValue, setInputValue] = React.useState(initialValue ?? '');

  const options = React.useMemo(() => {
    return prepareOptions(optionsIn ?? []);
  }, [optionsIn]);

  const menuDisabled = allowCreation && allowDuplicates && options.length === 0;

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (menuOpen) {
        e.stopPropagation();
      }
    },
    [menuOpen]
  );

  const colorStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: 'none',
      backgroundColor: theme.bgCell,
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: theme.bgCell,
    }),
    option: (styles, state) => ({
      ...styles,
      fontSize: theme.editorFontSize,
      fontFamily: theme.fontFamily,
      color: theme.textDark,
      ...(state.isFocused ? { backgroundColor: theme.accentLight, cursor: 'pointer' } : {}),
      ':active': {
        ...styles[':active'],
        color: theme.accentFg,
        backgroundColor: theme.accentColor,
      },
    }),
    input: (styles, { isDisabled }) => {
      if (isDisabled) {
        return { display: 'none' };
      }
      return {
        ...styles,
        fontSize: theme.editorFontSize,
        fontFamily: theme.fontFamily,
        color: theme.textDark,
      };
    },
    placeholder: (styles) => ({
      ...styles,
      fontSize: theme.editorFontSize,
      fontFamily: theme.fontFamily,
      color: theme.textLight,
    }),
    noOptionsMessage: (styles) => ({
      ...styles,
      fontSize: theme.editorFontSize,
      fontFamily: theme.fontFamily,
      color: theme.textLight,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      color: theme.textLight,
      ':hover': {
        color: theme.textDark,
        cursor: 'pointer',
      },
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: data.color ?? theme.bgBubble,
      borderRadius: `${theme.roundingRadius ?? BUBBLE_HEIGHT / 2}px`,
    }),
    multiValueLabel: (styles, { data, isDisabled }) => ({
      ...styles,
      paddingRight: isDisabled ? BUBBLE_PADDING : 0,
      paddingLeft: BUBBLE_PADDING,
      paddingTop: 0,
      paddingBottom: 0,
      color: data.color ? (getLuminance(data.color) > 0.5 ? 'black' : 'white') : theme.textBubble,
      fontSize: theme.editorFontSize,
      fontFamily: theme.fontFamily,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      height: BUBBLE_HEIGHT,
    }),
    multiValueRemove: (styles, { data, isDisabled, isFocused }) => {
      if (isDisabled) {
        return { display: 'none' };
      }
      return {
        ...styles,
        color: data.color ? (getLuminance(data.color) > 0.5 ? 'black' : 'white') : theme.textBubble,
        backgroundColor: undefined,
        borderRadius: isFocused ? `${theme.roundingRadius ?? BUBBLE_HEIGHT / 2}px` : undefined,
        ':hover': {
          cursor: 'pointer',
        },
      };
    },
  };

  const submitValues = React.useCallback(
    (values: string[]) => {
      const mappedValues = values.map((v) => {
        return allowDuplicates && v.startsWith(VALUE_PREFIX) ? v.replace(new RegExp(VALUE_PREFIX_REGEX), '') : v;
      });
      setValue(mappedValues);
      onChange({
        ...cell,
        data: {
          ...cell.data,
          values: mappedValues,
        },
      });
    },
    [cell, onChange, allowDuplicates]
  );

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!inputValue) {
          onFinishedEditing(cell, [0, 1]);
          return;
        }

        if (allowDuplicates && allowCreation) {
          setInputValue('');
          submitValues([...(value ?? []), inputValue]);
          setMenuOpen(false);
          event.preventDefault();
        }
    }
  };

  const SelectComponent = allowCreation ? CreatableSelect : Select;
  return (
    <div className="flex flex-col items-stretch my-auto" onKeyDown={onKeyDown} data-testid="multi-select-cell">
      <SelectComponent
        className="font-sans text-sm"
        isMulti={true}
        isDisabled={cell.readonly}
        isClearable={true}
        isSearchable={true}
        inputValue={inputValue}
        onInputChange={setInputValue}
        options={options}
        placeholder={cell.readonly ? '' : allowCreation ? 'Add...' : undefined}
        noOptionsMessage={(input) => {
          return allowCreation && allowDuplicates && input.inputValue ? `Create "${input.inputValue}"` : undefined;
        }}
        menuIsOpen={cell.readonly ? false : menuOpen}
        onMenuOpen={() => setMenuOpen(true)}
        onMenuClose={() => setMenuOpen(false)}
        value={resolveValues(value, options, allowDuplicates)}
        onKeyDown={cell.readonly ? undefined : handleKeyDown}
        menuPlacement={'auto'}
        menuPortalTarget={document.getElementById('portal')}
        autoFocus={true}
        openMenuOnFocus={true}
        openMenuOnClick={true}
        closeMenuOnSelect={true}
        backspaceRemovesValue={true}
        escapeClearsValue={false}
        styles={colorStyles}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Menu: (props) => {
            if (menuDisabled) {
              return null;
            }
            return (
              <div className="font-sans text-sm text-gray-800">
                <div className="rounded border border-gray-200 click-outside-ignore">{props.children}</div>
              </div>
            );
          },
        }}
        onChange={async (e) => {
          if (e === null) {
            return;
          }
          submitValues(e.map((x) => x.value));
        }}
      />
    </div>
  );
};

const renderer: CustomRenderer<MultiSelectCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is MultiSelectCell => (c.data as any).kind === 'multi-select-cell',
  draw: (args, cell) => {
    const { ctx, theme, rect, highlighted } = args;
    const { values, options: optionsIn } = cell.data;

    if (values === undefined || values === null) {
      return true;
    }

    const options = prepareOptions(optionsIn ?? []);

    const drawArea: Rectangle = {
      x: rect.x + theme.cellHorizontalPadding,
      y: rect.y + theme.cellVerticalPadding,
      width: rect.width - 2 * theme.cellHorizontalPadding,
      height: rect.height - 2 * theme.cellVerticalPadding,
    };
    const rows = Math.max(1, Math.floor(drawArea.height / (BUBBLE_HEIGHT + BUBBLE_PADDING)));

    let { x } = drawArea;
    let row = 1;

    let y =
      rows === 1
        ? drawArea.y + (drawArea.height - BUBBLE_HEIGHT) / 2
        : drawArea.y + (drawArea.height - rows * BUBBLE_HEIGHT - (rows - 1) * BUBBLE_PADDING) / 2;
    for (const value of values) {
      const matchedOption = options.find((t) => t.value === value);
      const color = matchedOption?.color ?? (highlighted ? theme.bgBubbleSelected : theme.bgBubble);
      const displayText = matchedOption?.label ?? value;
      const metrics = measureTextCached(displayText, ctx);
      const width = metrics.width + BUBBLE_PADDING * 2;
      const textY = BUBBLE_HEIGHT / 2;

      if (x !== drawArea.x && x + width > drawArea.x + drawArea.width && row < rows) {
        row++;
        y += BUBBLE_HEIGHT + BUBBLE_PADDING;
        x = drawArea.x;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      roundedRect(ctx, x, y, width, BUBBLE_HEIGHT, theme.roundingRadius ?? BUBBLE_HEIGHT / 2);
      ctx.fill();

      ctx.fillStyle = matchedOption?.color ? (getLuminance(color) > 0.5 ? '#000000' : '#ffffff') : theme.textBubble;
      ctx.fillText(displayText, x + BUBBLE_PADDING, y + textY + getMiddleCenterBias(ctx, theme));

      x += width + BUBBLE_MARGIN;
      if (x > drawArea.x + drawArea.width + theme.cellHorizontalPadding && row >= rows) {
        break;
      }
    }

    return true;
  },
  measure: (ctx, cell, t) => {
    const { values, options } = cell.data;

    if (!values) {
      return t.cellHorizontalPadding * 2;
    }

    const labels = resolveValues(values, prepareOptions(options ?? []), cell.data.allowDuplicates).map(
      (x) => x.label ?? x.value
    );

    return (
      labels.reduce((acc, data) => ctx.measureText(data).width + acc + BUBBLE_PADDING * 2 + BUBBLE_MARGIN, 0) +
      2 * t.cellHorizontalPadding -
      4
    );
  },
  provideEditor: () => ({
    editor: Editor,
    disablePadding: true,
    deletedValue: (v) => ({
      ...v,
      copyData: '',
      data: {
        ...v.data,
        values: [],
      },
    }),
  }),
  onPaste: (val: string, cell: MultiSelectCellProps) => {
    if (!val || !val.trim()) {
      return {
        ...cell,
        values: [],
      };
    }
    let values = val.split(',').map((s) => s.trim());

    if (!cell.allowDuplicates) {
      values = values.filter((v, index) => values.indexOf(v) === index);
    }

    if (!cell.allowCreation) {
      const options = prepareOptions(cell.options ?? []);
      values = values.filter((v) => options.find((o) => o.value === v));
    }

    if (values.length === 0) {
      return undefined;
    }
    return {
      ...cell,
      values,
    };
  },
};

export default renderer;
