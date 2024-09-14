import React, { memo } from 'react';
import clsx from 'clsx';

const CheckboxGroup = ({ label, options = [], register, errors, id, validate, style, fullWidth }) => {
 return (
    <div className={clsx('flex flex-col gap-2 ', style)}>
      {label && <label>{label}</label>}
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {options?.map((el, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              id={`${id}-${el.code}`}
              value={el?.value}
              {...register(id, validate)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <label htmlFor={`${id}-${el.code}`} className="ml-2">{el.value}</label>
          </div>
        ))}
      </div>
      {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
    </div>
 );
};

export default memo(CheckboxGroup);