import React from 'react';
import classes from './InputSuggestionList.module.css';

const InputSuggestionList = (props) => {
    return props.filteredSuggestions.length ? (
        <ul className={classes.suggestions}>
            {props.filteredSuggestions.map((suggestion, index) => {
                let className;
                if (index === props.activeSuggestionIndex) {
                    className = "suggestion-active";
                }
                return (
                    <li className={classes[className]} key={suggestion} onClick={props.onClick}>
                        {suggestion}
                    </li>
                );
            })}
        </ul>
    ) : (
        <div className={classes.noSuggestions}>
            <em>No suggestions Found</em>
        </div>
    );
};

export default InputSuggestionList;
