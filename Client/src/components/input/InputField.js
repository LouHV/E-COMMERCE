import React, { memo } from 'react'
import clsx from 'clsx'


const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidField, style, fullWidth, placeholder, isHideLabel }) => {
    return (
        <div className={clsx(' flex flex-col relative mb-2', fullWidth && 'w-full')}>
            {!isHideLabel && value?.trim() !== '' && <label className='text-[10px] absolute top-0 left-[12px] text-sm block bg-white px-1' htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
            <input
                type={type || 'text'}
                className={clsx('px-4 py-2 rounded-sm border w-full my-3 mt-2', style)}
                placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidField && setInvalidField([])}
            />

            {invalidFields?.some(el => el.name === nameKey) &&
                <small className='text-main text-[10px] italic mt-[-10px]'>{invalidFields.find(
                    el => el.name === nameKey
                )?.message}</small>}
        </div>
    )
}
// [ {name: password, mes: Require}]
export default memo(InputField)