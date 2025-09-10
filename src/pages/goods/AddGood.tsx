import { Cascader } from "antd";
import { lazy } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// 在组件外部建立缓存
const formComponentCache = new Map();

function getLazyForm(catId: string) {
  if (!formComponentCache.has(catId)) {
    formComponentCache.set(
      catId,
      lazy(() =>
        import(`./forms/${catId}.tsx`).catch(
          () => import("./forms/DefaultForm.tsx")
        )
      )
    );
  }
  return formComponentCache.get(catId);
}

function AddGood() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catId = searchParams.get("catId") || "DefaultForm";

  // 动态加载表单
  const FormComponent = getLazyForm(catId);

  // 选项
  const options = [
    {
      value: "DigitalProduct",
      label: "手机数码",
      children: [
        {
          value: "phone",
          label: "手机",
        },
        {
          value: "pc",
          label: "电脑",
        },
      ],
    },
    {
      value: "Cloth",
      label: "服装鞋包",
      children: [
        {
          value: "cloth",
          label: "衣服",
        },
        {
          value: "pants",
          label: "裤子",
        },
      ],
    },
  ];

  return (
    <>
      <Cascader
        options={options}
        placeholder="请选择类型"
        onChange={(value: any) => {
          console.log(value[0]);
          const newParams = new URLSearchParams(searchParams);
          newParams.set("catId", value[0]);
          navigate(`?${newParams.toString()}`, { replace: true });
        }}
        style={{ marginBottom: "10px" }}
      />
      <FormComponent />
    </>
  );
}

export default AddGood;
