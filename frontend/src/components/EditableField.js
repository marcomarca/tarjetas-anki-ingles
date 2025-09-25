import React, { useState } from 'react';

function EditableField({ initialValue, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== initialValue) {
            onSave(value);
        }
    };

    if (isEditing) {
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                autoFocus
                className="p-1 border rounded-md w-full bg-white"
            />
        );
    }

    return (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer min-h-[2.5rem] p-1">
            {value || <span className="text-gray-400">Click to edit</span>}
        </div>
    );
}

export default EditableField;