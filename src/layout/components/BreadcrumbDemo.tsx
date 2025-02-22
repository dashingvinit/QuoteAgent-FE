import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function BreadcrumbDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  let currentLink = '';

  const pathnames = location.pathname.split('/').filter((crumb) => crumb !== '');

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <Breadcrumb className="overflow-hidden w-full">
      <BreadcrumbList className="flex items-center">
        <BreadcrumbItem className="truncate max-w-[150px]">
          <BreadcrumbLink onClick={() => handleClick('/')} className="truncate cursor-pointer">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.length > 0 && (
          <BreadcrumbSeparator>
            <ChevronRight className="text-gray-500" />
          </BreadcrumbSeparator>
        )}
        {pathnames.map((crumb, index) => {
          currentLink += `/${crumb}`;
          const title = decodeURIComponent(crumb);
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={currentLink}>
              <BreadcrumbItem className="">
                {isLast ? (
                  <BreadcrumbPage className=" text-gray-500">
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => handleClick(currentLink)}
                    className="truncate  cursor-pointer">
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="text-gray-500" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
