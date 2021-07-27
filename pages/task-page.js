import Link from 'next/link';
import { useEffect } from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import Task from '../components/Task';
import TaskForm from '../components/TaskForm';
import StateContextProvider from '../context/stateContext';
import { getAllTasksData } from '../lib/tasks';

const fetcher = (url) => fetch(url).then((res) => res.json());
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`;

export default function TaskPage({ staticfilteredTasks }) {

    const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
        initialData: staticfilteredTasks,
    });

    const filterdTasks = tasks?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    useEffect(() => {
        mutate();
    }, []);

    return (
        <StateContextProvider>
            <Layout title="Task Page">
                <TaskForm taskCreated={mutate}/>
                <ul>
                    {filterdTasks && filterdTasks.map((task) => <Task key={task.id} task={task} taskDeleted={mutate}/>)}
                </ul>
                <Link href='/main-page'>
                    <div className='flex cursor-pointer mt-12'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        <span>Back to main page</span>
                    </div>
                </Link>
            </Layout>
        </StateContextProvider>
    )
};

export async function getStaticProps() {
    const staticfilteredTasks = await getAllTasksData();

    return {
        props: { staticfilteredTasks },
        revalidate: 3,
    };
}
