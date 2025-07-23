import { useEffect, useState } from "react";

const BredCrumbsNDL = (props) => {
  const [breadcrump,setbreadcrump]=useState(props.breadcrump)
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [prevActiveIndex, setPrevActiveIndex] = useState(-1);
 
  const limit = 5;

  useEffect(() => {
    setbreadcrump(props.breadcrump)
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [props.breadcrump])
  
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
   };

  const handleItemClick = (index, item) => {
    if (isExpanded && index === breadcrump.length - 1) {
      setIsExpanded(false);
      setActiveIndex(-1);
      setPrevActiveIndex(-1);
      
    }
    else{
      setPrevActiveIndex(activeIndex);
    setActiveIndex(index);
    props.onActive(index, item);
    
    }
    if (isExpanded && index === breadcrump.length - 1) {
      setActiveIndex(index);
      setPrevActiveIndex(index - 1);
      props.onActive(index, item)
      
    }
  };

  const breadcrumbItems = breadcrump.map((item, index) => {
    const isActive = index === activeIndex;
    const isPrevActive = index === prevActiveIndex;
    const lastelement = (index === breadcrump.length - 1) ? true:false
    if (index === 0 || index === breadcrump.length - 1 || index <= 3|| isExpanded) {
      let TextCol = isPrevActive ? "text-gray-400" : "text-gray-500"
      let buttonClassName = `hover:text-Text-text-secondary dark:hover:text-Text-text-secondary-dark  max-w-[${props.maxwidth ? props.maxwidth : '300px'}] text-ellipsis whitespace-nowrap overflow-hidden ${
        isActive ? "text-Text-text-primary dark:text-Text-text-primary-dark focus:border focus:text-Text-text-secondary dark:focus:text-Text-text-secondary-dark focus:border-solid focus:border-interact-accent-hover " : TextCol
      } ${lastelement ? "text-Text-text-primary dark:text-Text-text-primary-dark font-geist-sans font-medium  text-[16px] leading-[18px] " : "text-[16px] leading-[18px] text-Text-text-tertiary font-normal font-geist-sans"}`;

      return (

        <li key={item.index}>
          <button
            type="button"
            className={buttonClassName}
            onClick={() => handleItemClick(index, item)}
            
            
          >
            {item.name}
          </button>
          {index !== breadcrump.length - 1 && <span className="ml-1 mr-2  dark:text-Text-text-primary-dark  text-Text-text-primary text-[16px] leading-[18px]  font-geist-sans font-normal">/</span>}
        </li>
      );
    } else if (index === limit - 1) {
      let buttonClassName = `hover:text-Text-text-secondary  dark:hover:text-Text-text-secondary-dark text-Text-text-tertiary dark:text-Text-text-tertiary-dark  text-base leading-[22px] font-normal${
        isPrevActive ? "text-Text-text-tertiary   dark:text-Text-text-tertiary-dark" : ""
      }`;

      return (
        <li  key={item.index}>
          <button
            type="button"
            className={buttonClassName}
            onClick={handleExpand}
          >
            ...
          </button>
          <span className="ml-1 mr-2 text-Text-text-primary dark:text-Text-text-primary-dark  text-base leading-[22px] " >/</span>
        </li>
      );
    }

    return null;
  });

  return (
    <nav className="flex  dark:text-Text-text-primary-dark  text-Text-text-primary text-[16px] leading-[18px]  font-geist-sans font-medium">
      <ol className="flex items-center m-0">{breadcrumbItems}</ol>
      
      <style>
        {`
          ol.flex {
            display: flex;
            flex-wrap: wrap;
          }

         
        `}
      </style>
    </nav>
  );
};

export default BredCrumbsNDL;





