"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getTransactions } from "@/lib/transactions";
import FinancialCard from "@/components/FinancialCard";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FormatDate from "@/components/FormatDate";
import FormatValue from "@/components/FormatValue";
import PaginationBar from "@/components/PaginationBar";
import Detail from "@/components/Detail";
import { Transaction } from "@/lib/transactions";
import { Select, Dropdown, Button, MenuProps } from "antd";

import Calendar from "@/components/CalendarPopup";

interface PageProps {
  searchParams: { page?: string };
}
const PAGE_SIZE = 10;

export default function HomePage({ searchParams }: PageProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [clicked, setClicked] = useState(false);
  // const transactions = await getTransactions();
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [downloadbutton, setDownloadbutton] = React.useState<boolean>(false);
  const [searchExtend, setSearchExtend] = React.useState<boolean>(false);
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [transaction, setTransaction] = React.useState<Transaction | undefined>(
    undefined
  );
  const [order, setOrder] = React.useState<string | undefined>(undefined);

  const [tipo, setTipo] = React.useState<string | undefined>(undefined);

  const showDrawer = (_transaction: Transaction) => {
    setTransaction(_transaction);
    setClicked(true);

    console.log(_transaction);
  };

  React.useEffect(() => {
    (async () => {
      const { transactions, pageCount } = await getTransactions(
        PAGE_SIZE,
        page
      );
      console.log(transactions);
      setTransactions(transactions);
      setPageCount(pageCount);
    })();
  }, []);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex  flex-row rounded-lg bg-white items-center">
          <svg width={24} height={24}>
            <use href="#svg-left-arrow" />
          </svg>
          <p className="text-xs mx-5">02/05/22 à 08/05/22</p>
          <svg width={24} height={24}>
            <use href="#svg-right-arrow" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="w-[88px] hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex-grow bg-[#F3F3F5]">
          <Navbar />
          <div className="flex items-center p-3 mx-2 gap-3">
            <p className="font-bold text-xl flex flex-grow">Extracto</p>
            <button onClick={()=>setSearchExtend(!searchExtend)}>
              <svg width={40} height={40} className="block md:hidden">
                <use href="#svg-collapse" />
              </svg>
            </button>

            <div className="hidden sm:block">
              {" "}
              <div className="flex flex-row gap-2 ">
                <div className="flex  flex-row rounded-lg bg-white border border-[#DDDEE3] p-2 items-center">
                  <svg width={24} height={24}>
                    <use href="#svg-left-arrow" />
                  </svg>
                  <p className="text-xs mx-5">02/05/22 à 08/05/22</p>
                  <svg width={24} height={24}>
                    <use href="#svg-right-arrow" />
                  </svg>
                </div>
                <div className="flex flex-row justify-between rounded-lg bg-white border border-[#DDDEE3] py-2 items-center w-[151px]">
                  <p className="text-xs mx-5">Semanal</p>
                  <svg width={24} height={24}>
                    <use href="#svg-down-arrow" />
                  </svg>
                </div>
                <Select
                  value={"Todo"}
                  size="large"
                  defaultValue="Todo"
                  open={isOpen}
                >
                  <Select.Option onClick={() => setIsOpen(false)} value="Todo">
                    Todo Período
                  </Select.Option>
                  <Select.Option
                    onClick={() => setIsOpen(false)}
                    value="saaample"
                  >
                    <Dropdown
                      //@ts-ignore
                      placement="left"
                      menu={{ items }}
                    >
                      <div onClick={() => setIsOpen(true)}>topLeft</div>
                    </Dropdown>
                  </Select.Option>
                  <Select.Option>
                    <Calendar />
                  </Select.Option>
                  <Select.Option onClick={() => setIsOpen(false)} value="df">
                    Mensal
                  </Select.Option>
                  <Select.Option onClick={() => setIsOpen(false)} value="rr">
                    Personalizado
                  </Select.Option>
                </Select>
                <Select
                  value={tipo}
                  size="large"
                  onChange={(value: string) => {
                    setTipo(value);
                  }}
                  defaultValue="tipo de transaco"
                >
                  <Select.Option value="tipo de transaco">
                    Tipo de transaco
                  </Select.Option>
                  <Select.Option value="saaample">asdf</Select.Option>
                  <Select.Option value="df">asdf</Select.Option>
                  <Select.Option value="rr">erer</Select.Option>
                </Select>
              </div>
            </div>

            {/* <Dropdown label="Dropdown button" renderTrigger={() => (
                <div className='flex flex-row justify-between rounded-lg bg-white border border-[#DDDEE3] py-2 items-center w-[151px]'>
                  <p className='text-xs ml-2'>Tipo de transação</p>
                  <svg width={24} height={24}><use href='#svg-down-arrow' /></svg>
                </div>
              )}
            >
              <Dropdown.Item>Dashboard</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Separated link</Dropdown.Item>
            </Dropdown> */}

            <div className="relative mt-2">
              <button
                onClick={() => {
                  setDownloadbutton(!downloadbutton);
                }}
              >
                <svg width={40} height={40}>
                  <use href="#svg-download" />
                </svg>
              </button>
              {downloadbutton && (
                <>
                  <div className="flex flex-col w-28 bg-white rounded-sm absolute top-[40px] right-0">
                    <button className=" p-2 text-left">PDF</button>
                    <button className=" p-2 text-left">Excel</button>
                  </div>
                </>
              )}
            </div>
          </div>
           { searchExtend && (
            <div className="block md:hidden m-4">
              <div className="flex flex-col w-full gap-4">
                <div>
                  //!Semanal
                  //!Tipo
                </div>
              </div>
            </div>
           )

           }     
          <div className="flex flex-row gap-4 pb-5 px-5">
            <FinancialCard
              svg={"#svg-transacoes"}
              text={"Qtd. Transações"}
              value="250"
            />
            <div className="hidden sm:block">
              <div className="flex flex-row gap-4">
                <FinancialCard
                  svg={"#svg-wallet"}
                  text={"Saldo Inicial"}
                  value="R$ 1.500,00"
                />
                <FinancialCard
                  svg={"#svg-transacoes"}
                  text={"Entradas (R$)"}
                  value="R$ 1.500,00"
                />
                <FinancialCard
                  svg={"#svg-transacoes"}
                  text={"Saídas (R$)"}
                  value="R$ 3.500,00"
                />
                <FinancialCard
                  svg={"#svg-transacoes"}
                  text={"Total"}
                  value="R$ 1.500,00"
                />
                <FinancialCard
                  svg={"#svg-transacoes"}
                  text={"Saldo Final"}
                  value="R$ 2.000,00"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex-l px-5">
              <div className="grid grid-cols-12 gap-2">
                <p className="col-span-2 text-sm font-bold p-4">Data</p>
                <p className="col-span-4 text-sm font-bold p-4">Descrição</p>
                <p className="col-span-2 text-sm font-bold p-4">Prestador</p>
                <p className="col-span-1 text-sm font-bold p-4">Tipo</p>
                <p className="col-span-2 text-sm font-bold p-4 text-center">
                  Valor
                </p>
              </div>

              <div>
                <Detail
                  clicked={clicked}
                  setClicked={setClicked}
                  transaction={transaction}
                />
              </div>
              {transactions.map((_transaction: Transaction, index) => (
                <div
                  key={index}
                  className="w-full grid grid-cols-12 bg-white my-2 py-1"
                >
                  <p className="col-span-2 text-sm p-2 flex flex-row items-center gap-2">
                    <svg width={16} height={16}>
                      <use href="#svg-calendar" />
                    </svg>
                    <FormatDate
                      dateString={`${_transaction.Data}`}
                      time={`${_transaction.time}`}
                    />
                  </p>
                  <p className="col-span-4 text-sm p-2 flex items-center">
                    {_transaction.Descricao}
                  </p>
                  <p className="col-span-2 text-sm p-2 flex items-center">
                    {_transaction.Tipo === "Retirada" ? (
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src="/avatar2.png"
                          alt="avatar2"
                          width={24}
                          height={24}
                        />
                        <p className="text-sm">{_transaction.Prestador}</p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </p>
                  <p
                    className={`col-span-1 text-sm my-1 p-1 rounded-full px-4 justify-center flex items-center ${
                      _transaction.Tipo === "Retirada"
                        ? "bg-red-300 text-red-600"
                        : "bg-green-300 text-green-600"
                    }`}
                  >
                    {_transaction.Tipo}
                  </p>
                  <p
                    className={`col-span-2 text-sm p-2 font-bold ml-auto mr-6 flex items-center  ${
                      _transaction.Valor > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <FormatValue value={_transaction.Valor} />
                  </p>
                  <p className="col-span-1 text-sm p-2 ml-auto mr-2 flex items-center">
                    <button onClick={() => showDrawer(_transaction)}>
                      <svg width={24} height={24}>
                        <use href="#svg-detail" />
                      </svg>
                    </button>
                  </p>
                </div>
              ))}
            </div>
            <div className="ml-auto mr-10 mt-10">
              <PaginationBar href="/" page={page} pageCount={pageCount} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
