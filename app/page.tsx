"use client"

import React, { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { Select, Popover, MenuProps, Checkbox } from "antd";

import { getTransactions } from '@/lib/transactions'
import FinancialCard from '@/components/FinancialCard';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { FormatDate, DetailedDate } from '@/components/FormatDate';
import FormatValue from '@/components/FormatValue';
import PaginationBar from '@/components/PaginationBar';
import Detail from '@/components/Detail';
import { Transaction } from '@/lib/transactions';
import Calendar from '@/components/CalendarPopup';
import Semanal from '@/components/Semanal';
import Mensal from '@/components/Mensal'
import Custom from '@/components/Custom'

interface PageProps {
  searchParams: { page?: string };
}

const PAGE_SIZE = 10;

export default function HomePage({ searchParams }: PageProps) {
  const [clicked, setClicked] = useState(false)
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [downloadbutton, setDownloadbutton] = React.useState<boolean>(false)
  const [pageCount, setPageCount] = React.useState<number>(0);
  const [transaction, setTransaction] = React.useState<Transaction | undefined>(undefined);
  const [periodOption, setPeriodOption] = React.useState<string | undefined>("Semanal");
  const [tipo, setTipo] = React.useState<string | undefined>(undefined);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = React.useState<boolean>(false);
  const [searchExtend, setSearchExtend] = React.useState<boolean>(false);

  const page = searchParams.page ? parseInt(searchParams.page) : 1


  const showDrawer = (_transaction: Transaction) => {
    setTransaction(_transaction);
    setClicked(true)
  }

  const handlePeriodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPeriodOption(e.target.value);
  }

  const handleSelectChange = (value) => {
    setTipo(value);
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange2 = (value) => {
    setSelectedOptions(value);
  };

  const renderOption = (option) => (
    <div>
      <Checkbox checked={selectedOptions.includes(option.value)} />
      {option.label}
    </div>
  );

  React.useEffect(() => {
    (async () => {
      const { transactions, pageCount } = await getTransactions(PAGE_SIZE, page);
      setTransactions(transactions);
      setPageCount(pageCount);
    })();
  }, [page]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className='flex  flex-row rounded-[10rem] bg-white items-center'>
          <svg width={24} height={24}><use href='#svg-left-arrow' /></svg>
          <p>02/05/22 à 08/05/22</p>
          <svg width={24} height={24}><use href='#svg-right-arrow' /></svg>
        </div>
      ),
    }
  ];

  return (
    <>
      <div className={`flex flex-row ${clicked ? 'bg-opacity-50 bg-gray-600' : ''}`}>
        <div className='w-[88px] hidden lg:block'>
          <Sidebar />
        </div>
        <div className='flex-grow bg-[#F3F3F5] md:none relative w-full'>
          <Navbar />
          <div className='flex items-center py-[3rem] mx-[2rem] gap-[2rem] px-[1rem] md:px-[3rem]'>
            <p className='font-bold md:[5-rem] sm-[4.5rem] lg:text-[5rem] md:text-[4.5rem] sm:text-[4.6rem] text-[3.2rem] flex flex-grow'>Extracto</p>
            <button onClick={() => setSearchExtend(!searchExtend)}>
              <svg width={30} height={30} className='block md:hidden'><use href='#svg-collapse' /></svg>
            </button>

            <div className="hidden md:block">
              {" "}
              <div className="flex flex-row align-center lg:w-[50vw] w-[60vw] justify-end gap-[1rem]">
                {
                  periodOption === "Semanal" ? <Semanal /> : (periodOption === "Mensal" ? <Mensal /> : <Custom />)
                }               
                
                <Select value={periodOption} 
                  onChange={(value: string) => {
                    setPeriodOption(value);
                  }}
                  className='lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] h-[30px]'
                >
                  <Select.Option value="Semanal">Semanal</Select.Option>
                  <Select.Option value="Mensal">Mensal</Select.Option>
                  <Select.Option value="Personalizado">Personalizado</Select.Option>
                </Select> 

                {/* <Select value={tipo}
                  onChange={handleSelectChange}
                  defaultValue="Tipo de transação"
                >                  
                  <Select.Option value="Deposito">
                    {tipo !== "Deposito" ? <Checkbox /> : null}
                    Deposito
                  </Select.Option>
                  <Select.Option value="Pagemento Job">
                    {tipo !== "Pagemento Job" ? <Checkbox /> : null}
                    Pagemento Job
                  </Select.Option>
                </Select> */}
                <Select
                  mode="multiple"
                  value={selectedOptions}
                  onChange={handleSelectChange2}
                  placeholder="Tipo de transação"
                  style={{ width: '50%', height: "30px"}}
                  // optionLabelProp="label"
                  renderOption={renderOption}
                  className='lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem]'
                >
                  <Select.Option value="Deposito" label="Deposito">Deposito</Select.Option>
                  <Select.Option value="Pagamento Job" label="Pagamento Job">Pagamento Job</Select.Option>
                </Select>
              </div>
            </div>

            <div className='relative mt-2'>
              <button onClick={() => { setDownloadbutton(!downloadbutton) }}>
                <svg width={30} height={30}><use href='#svg-download' /></svg>
              </button>
              {downloadbutton && (<>
                <div className='flex flex-col w-[70px] bg-gray rounded-[1rem] absolute top-[30px] right-0 border-[2px] z-2'>
                  <button className=' p-[1rem] text-left lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem]'>PDF</button>
                  <button className=' p-[1rem] text-left lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem]'>XLS</button>
                </div>
              </>
              )}
            </div>
          </div>
          {searchExtend && (
            <div className="block md:hidden py-[1rem]">
              <div className="flex flex-col w-full gap-[2rem]">
                <div className='relative flex flex-row justify-between rounded-[1rem] bg-white border border-[#DDDEE3] py-2 items-center z-1'>
                  <div className='flex justify-between items-center w-full h-full pr-3' onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}>
                    <p className='sm:text-[2.7rem] text-[2rem] mx-5'>Semanal</p>
                    <svg width={24} height={24}><use href='#svg-down-arrow' /></svg>
                  </div>
                </div>  
                <Select
                  mode="multiple"
                  value={selectedOptions}
                  onChange={handleSelectChange2}
                  placeholder="Deposito"
                  style={{ width: '50%', height: "30px"}}
                  // optionLabelProp="label"
                  renderOption={renderOption}
                  className='lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem]'
                >
                  <Select.Option value="Deposito" label="Deposito">Deposito</Select.Option>
                  <Select.Option value="Pagamento Job" label="Pagamento Job">Pagamento Job</Select.Option>
                </Select>
              </div>
            </div>
          )}
         
          <div className='flex sm:w-full w-[100%] overflow-x-auto flow scroll-smooth sm:px-[3rem] px-[3rem]'>
            <div className='flex gap-[2rem] md:w-full w-[200rem] justify-between'>
              <FinancialCard
                svg={"#svg-transacoes"}
                text={"Qtd. Transações"}
                value="250"
              />
              <FinancialCard
                svg={"#svg-saldo"}
                text={"Saldo Inicial"}
                value="R$ 1.500,00"
              />
              <FinancialCard
                svg={"#svg-entradas"}
                text={"Entradas (R$)"}
                value="R$ 1.500,00"
              />
              <FinancialCard
                svg={"#svg-saidas"}
                text={"Saídas (R$)"}
                value="R$ 3.500,00"
              />
              <FinancialCard
                svg={"#svg-total"}
                text={"Total"}
                value="R$ 1.500,00"
              />
              <FinancialCard
                svg={"#svg-saldo-final"}
                text={"Saldo Final"}
                value="R$ 2.000,00"
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='flex-l px-[1rem] md:px-[3rem]'>
              <div className='hidden md:block'>
                <div className='grid grid-cols-12 gap-[2rem]'>
                  <p className='col-span-2 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] font-bold p-[2rem]'>Data</p>
                  <p className='col-span-4 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] font-bold p-[2rem]'>Descrição</p>
                  <p className='col-span-2 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] font-bold p-[2rem]'>Prestador</p>
                  <p className='col-span-1 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] font-bold p-[2rem]'>Tipo</p>
                  <p className='col-span-2 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] font-bold p-[2rem] text-center'>Valor</p>
                </div>
              </div>
              <div>
                <Detail clicked={clicked} setClicked={setClicked} transaction={transaction} />
              </div>
              {transactions.map((_transaction: Transaction, index) => (
                <div id='card'>
                  <div className='hidden md:block'>
                    <div key={index} className="w-full grid grid-cols-12 bg-white my-[1rem] py-[0.5rem] items-center" onClick={() => showDrawer(_transaction)}>
                      <p className='col-span-2 lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] p-[1rem] flex flex-row items-center gap-[2rem]'>
                        <svg width={16} height={16}><use href='#svg-calendar' /></svg>
                        <FormatDate dateString={`${_transaction.Data}`} time={`${_transaction.time}`} />
                      </p>
                      <p className='col-span-4 lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] p-[1rem] flex items-center'>{_transaction.Descricao}</p>
                      <p className='col-span-2 text-[2rem] p-[1rem] flex items-center'>
                        {_transaction.Tipo === 'Retirada' ? (
                          <div className='flex flex-row gap-[2rem] items-center'>
                            <Image src="/avatar2.png" alt="avatar2" width={24} height={24} />
                            <p className='lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem]'>{_transaction.Prestador}</p>
                          </div>) : (<div></div>)}
                      </p>
                      <p className={`col-span-1 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] h-[5rem] rounded-full px-4 justify-center flex items-center ${_transaction.Tipo === 'Retirada' ? 'bg-red-300 text-red-600' : 'bg-green-300 text-green-600'}`}>{_transaction.Tipo}</p>
                      <p className={`col-span-2 lg:text-[3rem] md:text-[2.7rem] sm:text-[2.7rem] text-[2rem] font-bold ml-[20rem] flex items-center  ${_transaction.Valor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <FormatValue value={_transaction.Valor} />
                      </p>
                      <p className='col-span-1 text-[2rem] px-[2rem] ml-auto flex items-center'>
                        <button onClick={() => showDrawer(_transaction)}>
                          <svg width={24} height={24}><use href='#svg-detail' /></svg>
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className='block md:hidden' onClick={() => showDrawer(_transaction)} id="bottomBar">
                    <div key={index} className="md:w-full w-full mx-auto bg-white my-2 rounded-lg">
                      <p className='lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] px-4 py-2 flex items-center'>{_transaction.Descricao}</p>
                      <div className='flex flex-row mx-6 my-4 justify-between'>
                        <p className='lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] px-[2rem] flex flex-row items-center gap-[2rem]'>
                          <svg width={16} height={16}><use href='#svg-calendar' /></svg>
                          <DetailedDate dateString={`${_transaction.Data}`} time={`${_transaction.time}`} />
                        </p>
                        <p className='lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] pr-4 pb-2 flex items-center '>
                          {_transaction.Tipo === 'Retirada' ? (
                            <div className='flex flex-row gap-[2rem] items-center'>
                              <Image src="/avatar2.png" alt="avatar2" width={24} height={24} />
                              <p className='lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem]'>{_transaction.Prestador}</p>
                            </div>) : (<div></div>)}
                        </p>
                      </div>
                      <div className='flex sm:py-[1rem] sm:px-[1rem] px-[1.5rem] py-[1rem] flex-row justify-between border-t-2 border-gray-300'>
                        <p className={`lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] rounded-full px-4 justify-center flex items-center ${_transaction.Tipo === 'Retirada' ? 'bg-red-300 text-red-600' : 'bg-green-300 text-green-600'}`}>{_transaction.Tipo}</p>
                        <p className={`lg:text-[3.5rem] md:text-[3.1rem] sm:text-[3.1rem] text-[2.2rem] sm:px-[1rem] font-bold ml-[20rem] flex items-center  ${_transaction.Valor > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <FormatValue value={_transaction.Valor} />
                        </p>
                      </div>
                    </div>
                  </div>                 
                </div>
              ))}
            </div>
          </div>
          <div className='md:fixed absolute md:bottom-[2rem] md:right-[3rem] bottom-[-7rem] right-[0rem]'>
            <PaginationBar href="/" page={page} pageCount={pageCount} />
          </div>
        </div>
      </div >
    </>
  );
};



