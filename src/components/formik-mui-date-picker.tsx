// components/MuiDatePicker.tsx
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { useField, useFormikContext } from "formik";
import dayjs from 'dayjs';

// Add a name property and reuse the date picker props.
type Props<TDate> = {
  name: string;
} & DatePickerProps<TDate>;

const FormikMuiDatePicker = <TDate,>({ name, ...props }: Props<TDate>) => {
  // use useField hook to get the state values for this field via the name prop.
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  return (
    <div className="form-control w-full max-w-xs">
      <DatePicker
        {...props}
        // use the DatePicker component override the value formik state value
        value={dayjs(field.value) as TDate}
        // modify the formik state using setFieldValue
        onChange={(val) => {
          setFieldValue(name, val);
        }}
      />
      {/* Show an error message if there's any */}
      {meta.error && (
        <label className="label">
          <span className="label-text-alt text-error">{meta.error}</span>
        </label>
      )}
    </div>
  );
};

export default FormikMuiDatePicker;
