'use client';

import {ProductGrid} from '@components/product/product-grid';
import SearchTopBar from '@components/search/search-top-bar';
import Container from '@components/ui/container';
import {Element} from 'react-scroll';
import {useState} from "react";
export default function ProductsPageContent({lang}: { lang: string }) {
    const [viewAs, setViewAs] = useState(Boolean(true));
    return (
        <Container>
            {/* @ts-ignore */}
            <Element name="grid" className="flex pb-16 pt-7 lg:pt-11 lg:pb-20">
                <div className="w-full lg:ltr:-ml-4 lg:rtl:-mr-2 xl:ltr:-ml-8 xl:rtl:-mr-8 lg:-mt-1">
                    <SearchTopBar lang={lang}  viewAs={viewAs} onNavClick={setViewAs}/>
                    <ProductGrid lang={lang} viewAs={viewAs} />
                </div>
            </Element>
        </Container>
    );
}
