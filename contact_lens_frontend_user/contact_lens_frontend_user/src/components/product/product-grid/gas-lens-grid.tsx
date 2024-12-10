import { useState, useEffect, type FC } from 'react';
import { useAppDispatch, useAppSelector } from 'src/lib/hook';
import { RootState } from 'src/lib/store';
import Button from '@components/ui/button';
import GasLensCard from '../product-items/card-items/gas-lens-card';
import GasLensList from '../product-items/list-items/gas-lens-list';
import Pagination from '@components/ui/pagination';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { Product } from '@utils/types';
import { getAllGasPermeableLensThunk } from 'src/lib/reducers/lensSlice';

interface GasLensGridProps {
  lang: string;
  className?: string;
  viewAs: boolean;
}

export const GasLensGrid: FC<GasLensGridProps> = ({
  className = '',
  lang,
  viewAs,
}) => {
  const dispatch = useAppDispatch();
  const countPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loading,
    gasPermeableLens,
    total_count,
    error,
  }: { loading: boolean; gasPermeableLens: any; total_count: number; error: string } =
    useAppSelector((state: RootState) => state.lens);
  const updatePage = (p: any) => {
    setCurrentPage(p);
    dispatch(
      getAllGasPermeableLensThunk({
        limit: countPerPage,
        offset: currentPage * countPerPage - 1,
      })
    );
  };

  useEffect(()=>{
    if (currentPage === 1) {
        dispatch(
            getAllGasPermeableLensThunk({
              limit: countPerPage,
              offset: currentPage * countPerPage - 1,
            })
          );
    }
  },[])

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div
        className={`${
          viewAs
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
            : 'grid grid-cols-1 gap-8'
        } ${className}`}
      >
        {gasPermeableLens.map((item: any, index: number) => {
          if (viewAs) {
            return (
              <GasLensCard
                key={`product--key-${index}`}
                product={item}
                lang={lang}
              />
            );
          } else {
            return (
              <GasLensList
                key={`product--key-${index}`}
                product={item}
                lang={lang}
              />
            );
          }
        })}
      </div>
      <div className="pt-8 text-center xl:pt-10">
        <Pagination
          current={currentPage}
          onChange={updatePage}
          pageSize={countPerPage}
          total={total_count}
          prevIcon={<GrPrevious size={12} style={{ color: '#090B17' }} />}
          nextIcon={<GrNext size={12} style={{ color: '#090B17' }} />}
          className="order-table-pagination"
        />
      </div>
    </>
  );
};
