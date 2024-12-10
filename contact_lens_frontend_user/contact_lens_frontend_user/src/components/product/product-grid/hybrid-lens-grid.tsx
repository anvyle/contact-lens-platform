import { useState, useEffect, type FC } from 'react';
import { useAppDispatch, useAppSelector } from 'src/lib/hook';
import { RootState } from 'src/lib/store';
import Button from '@components/ui/button';
import HybridLensCard from '../product-items/card-items/hybrid-lens-card';
import HybridLensList from '../product-items/list-items/hybrid-lens-list';
import Pagination from '@components/ui/pagination';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { Product } from '@utils/types';
import { getAllHybridLensThunk } from 'src/lib/reducers/lensSlice';

interface HybridLensGridProps {
  lang: string;
  className?: string;
  viewAs: boolean;
}

export const HybridLensGrid: FC<HybridLensGridProps> = ({
  className = '',
  lang,
  viewAs,
}) => {
  const dispatch = useAppDispatch();
  const countPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loading,
    hybridLens,
    total_count,
    error,
  }: { loading: boolean; hybridLens: any; total_count: number; error: string } =
    useAppSelector((state: RootState) => state.lens);
  const updatePage = (p: any) => {
    setCurrentPage(p);
    dispatch(
      getAllHybridLensThunk({
        limit: countPerPage,
        offset: currentPage * countPerPage - 1,
      })
    );
  };

  useEffect(()=>{
    if (currentPage === 1) {
        dispatch(
            getAllHybridLensThunk({
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
        {hybridLens.map((item: any, index: number) => {
          if (viewAs) {
            return (
              <HybridLensCard
                key={`product--key-${index}`}
                product={item}
                lang={lang}
              />
            );
          } else {
            return (
              <HybridLensList
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
