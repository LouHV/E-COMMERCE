import React, { memo } from 'react'
import useBreadcrumbs from "use-react-router-breadcrumbs"
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const BreadcrumbsBlog = ({ title }) => {

    const routes = [
        { path: "/blogs"},
        { path: "/", breadcrumb: "Home" },
        { path: "/blogs/:bid/:title", breadcrumb: title },
    ];
    const breadcrumbs = useBreadcrumbs(routes);

    return (
        <div className='text-sm flex items-center gap-1'>
            {breadcrumbs?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
                index !== self.length - 1 ? (
                    <Link className='flex gap-1 items-center hover:text-main cursor-pointer' key={match.pathname} to={match.pathname}>
                        <span className='capitalize'>
                            {breadcrumb}
                        </span>
                        <IoIosArrowForward />
                    </Link>
                ) : (
                    <span className='flex gap-1 items-center cursor-auto' key={match.pathname}>
                        <span className='capitalize'>
                            {breadcrumb}
                        </span>
                    </span>
                )
            ))}
        </div>
    )
}

export default memo(BreadcrumbsBlog)