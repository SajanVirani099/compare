"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getResultProduct } from "../redux/slice/blogSlice";
import { useRouter } from "next/navigation";

const Page = () => {
  const { resultProduct } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const router = useRouter();
  const queryParamas = new URLSearchParams();

  console.log("queryParamas", queryParamas);

  useEffect(() => {
    dispatch(getResultProduct());
  }, []);
  return (
    <>
      <h1 className="font-bold">Search Products Conetent is here</h1>
    </>
  );
};

export default Page;
