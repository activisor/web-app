// components/MuiDatePicker.tsx
import { DatePicker, type DatePickerProps } from "@mui/x-date-pickers";
import { useField, useFormikContext } from "formik";
import dayjs from 'dayjs';

// Add a name property, external handler, and reuse the date picker props.
interface FormikDatePickerProps<TDate> extends DatePickerProps<TDate> {
    name: string;
    handleChange: (dayOfWeek: number) => void;
}

const FormikMuiDatePicker = <TDate,>({ name, ...props }: FormikDatePickerProps<TDate>) => {
    // use useField hook to get the state values for this field via the name prop.
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();

    return (
        <div className="form-control w-full max-w-xs">
            <DatePicker
                {...props}
                // use the DatePicker component value, override the formik state value
                value={dayjs(field.value) as TDate}
                // modify the formik state using setFieldValue
                onChange={(val) => {
                    const date = val as dayjs.Dayjs;
                    props.handleChange(date.day())
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
