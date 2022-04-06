import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import classes from './FormElement.module.css';
import {GoInfo} from "react-icons/go"
import ReactTooltip from "react-tooltip";

const FormElement = (props) => {
    let inputElement = null;

    switch(props.elementType){
        case 'autocompleteInput':
             inputElement = <input
                 className={classes.InputElement}
                 type='text'
                 label={props.label}
                 placeholder={props.placeholder}
                value={props.value}
                onChange={props.changed}
               />
                break;
        case 'input':
            inputElement = <input  
            className={classes.InputElement} 
            {...props.elementConfig} 
            value={props.value}
            onChange={props.changed}/>
            break;
        case 'select':
            inputElement = <select required className={classes.InputElement}
                                   value={props.value}
                                   onChange={props.changed}>
                <option disabled={true} value="">{props.elementConfig.placeholder}</option>,
                { props.elementConfig.options.map(
                    option => (<option className={classes.SelectOption} value={option.id} >{option.displayValue}</option>)
                )}
            </select>
            break;
        case 'datePicker' :
            inputElement = <DatePicker className={classes.InputElement} selected={props.value} popperPlacement={'left-start'}
            onChange={props.changed} {...props.elementConfig} placeholderText={props.elementConfig.placeholder} dateFormat={'yyyy-MM-dd'}/>
            break;
        default:
            break;
    }
    return(
        <div className={classes.Input}>
            {props.label === 'Free Quantity' ?
                        <label className={classes.Label} >
                            <span className={classes.ToolTipLabel}>{props.label }
                                <GoInfo className={classes.InfoIcon} data-tip data-for="freeQuantityTip"/>
                           </span>
                            <ReactTooltip id="freeQuantityTip" place="top" effect="solid"
                                          multiline={true} backgroundColor={"lightgrey"}
                                          textColor={"black"}>
                                Free cases or water bottles sold under scheme.<br/>
                                Enter Free Quantity as count of bottles.
                            </ReactTooltip>
                        </label>
                 :  <label className={classes.Label} >{props.label }</label>}

            {inputElement}
        </div>
    )
}

export default FormElement;