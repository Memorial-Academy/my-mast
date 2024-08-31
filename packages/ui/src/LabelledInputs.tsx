import { ProtectedInput } from "./ProtectedInput"

type TextInputProps = {
    question: string,
    placeholder: string,
    name: string,
    type?: string,
    required?: boolean
    protected?: boolean
}

type SelectableInputProps = {
    name: string,
    values: Array<string>,
    type: "radio" | "checkbox",
    required?: boolean
}

export function LabelledInput(props: TextInputProps) {
    let elem = <></>;

    if (props.protected) {
        elem = (<ProtectedInput
            placeholder={props.placeholder}
            name={props.name}
            id={"input_" + props.name} 
        />)
    } else {
        elem = (<input
            id={"input_" + props.name}
            name={props.name}
            type={props.type ? props.type : "text"}
            placeholder={props.placeholder}
            className="labelled-input"
            required={props.required ? true : false}
        />)
    }
    
    return (
        <div className="labelled-input-wrapper">
            <label 
                htmlFor={"input_" + props.name}
                className={"labelled-input " + (props.required ? "required" : "")}
            >
                {props.question}
            </label>
            <br/>
            {elem}
        </div>
    )
}

export function MultipleChoice(props: SelectableInputProps) {
    return props.values.map(value => {
        const htmlValue = value.toLowerCase();
        let id = `input_${props.name}_${htmlValue}`;
        
        return (
            <>
                <input 
                    type={props.type}
                    value={htmlValue}
                    required={props.required ? true : false}
                    name={props.name}
                    id={id}
                    key={id}
                />
                <label htmlFor={id}>{value}</label>
                <br/>
            </>
        )
    })
}