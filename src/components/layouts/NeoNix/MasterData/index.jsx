import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { SigTabval } from "recoilStore/atoms";
import { useTranslation } from "react-i18next";
import CustomerTable from "./CustomerTable";
import TabListItems from "components/Core/Tabs/TabListItemNDL";
import TabContent from "components/Core/Tabs/TabContentNDL";
import VendorTable from "./Vendor/VendorTable";
import PolicyTable from "./PolicyTable";
import OperationsTable from "./OperationsTable";
import AssetsTable from "./Assets/index";
import Components from "./Components/index.jsx";
import ProductTable from "./Product/ProductTable";

export default function SignatureTabs(props) {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useRecoilState(SigTabval);
  const [showTabs, setShowTabs] = useState(true);


  useEffect(() => {
    if (props.module === "customer") {
      setTabValue(0);
    } else if (props.module === "company") {
      setTabValue(1);
    } else if (props.module === "vendor") {
      setTabValue(2);
    } else if (props.module === "policies") {
      setTabValue(3);
    }else if (props.module === "Assets") {
      setTabValue(4);
    } else if (props.module === "components") {
      setTabValue(5);
    }
    else if (props.module === "Operations master") {
      setTabValue(4);
    } else if (props.module === "Products") {
      setTabValue(5);
    }
  }, [props.module, setTabValue]);

  const MenuList = [


    {
      title: t("Customer Info"),
      content: <CustomerTable setShowTabs={setShowTabs} />,
    },
    // {
    //   title: t("Vendor Info"),
    //   content: <VendorTable setShowTabs={setShowTabs} />,
    // },
    {
      title: t("Policies"),
      content: <PolicyTable setShowTabs={setShowTabs} />,
    },
    {
      title: t("Operations Master"),
      content: <OperationsTable setShowTabs={setShowTabs} />,
    },
    {
      title: t("Assets"),
      content: <AssetsTable setShowTabs={setShowTabs} />,
    },
    {
      title: t("Components"),
      content: <Components setShowTabs={setShowTabs} />,
    },
    {
      title: t("Products"),
      content: <ProductTable setShowTabs={setShowTabs} />,
    },
  ];

  const handleTabChange = (event, index) => {
    setTabValue(index);
  };

  return (
    <div className="w-full bg-Background-bg-primary dark:bg-Background-bg-primary-dark">
      {showTabs && (
        <div className="flex flex-row w-full z-10">
          <TabListItems>
            {MenuList.map((item, index) => (
              <TabContent
                key={item.title}
                value={item.title}
                selected={tabValue === index}
                onClick={(event) => handleTabChange(event, index)}
              />
            ))}
          </TabListItems>
        </div>
      )}
      <div>{MenuList[tabValue]?.content}</div>
    </div>
  );
}
