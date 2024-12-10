/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Suspense, useEffect, useState } from 'react';

import UserTable from "./UserTable";
import Pagination from "../common/Pagination";

import useData from '@/hooks/useData';
import { useNotification } from '@/context/NotificationContext';
import { UsersProps } from '@/type';
import UserSettings from './UserSettings';
import UserEditModal from './UserEditModal';
import Loader from '../common/Loading';


export default function Users() {
    const [page, setPage] = useState<number>(1);
    const [limit, setPerPage] = useState<number>(20);
    const [users, setUsers] = useState<UsersProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>("");

    const { setSuccessMessage, setErrorMessage } = useNotification();

    const { data, error, loading, fetchData } = useData({
        method: "get",
        url: `/users/all?offset=${(page - 1) * limit}&limit=${limit}`
    });

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    useEffect(() => {
        if (data) {
            setUsers(data.data || []);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        }
    }, [error]);

    const pageControl = ({ page, limit }: { page: number, limit: number }) => {
        setPage(page);
        setPerPage(limit);
    };

    const openEditModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setSelectedUserId("");
    };

    const totalPages = data?.count ? Math.ceil(data.count / limit) : 1;

    return (
        <div className="w-full">
            <UserSettings />
            <div className="mt-4">
                <span className="font-bold text-sm">Total Users:</span>{' '}
                <span className="text-sm">{data?.count || 0}</span>
            </div>

            {loading ? (
                <Loader className="w-10 h-10" />
            ) : (
                !error && <UserTable users={users} toggleModal={openEditModal} />
            )}

            <UserEditModal
                id={selectedUserId}
                modalOpen={isModalOpen}
                toggleModal={closeEditModal}
            />

            <div className="mt-5 flex w-full justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <Pagination totalPages={totalPages} pageControl={pageControl} />
                </Suspense>
            </div>
        </div>
    );
}
