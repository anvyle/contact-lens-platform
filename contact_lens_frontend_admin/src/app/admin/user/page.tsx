import Users from '@/components/User';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Admin | Users"
}

export default function LoginPage() {
    return <Users />
}