import axios from 'axios';
import React from 'react';
import { useContext,useEffect ,useState} from 'react';
import { AuthContext } from '../context/FirebaseContext';
import Loading from '../components/common/Loading';
import MyBook from '../components/myBooks/MyBook';
import NoBook from '../components/myBooks/NoBook';
import useAxiosSecure from '../hooks/useAxiosSecure';

const MyBooks = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [myBooksLoading, setMyBooksLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    useEffect(() => {
        document.title = "LitShelf || MyBook";
      }, []);
    useEffect(() => {
        axiosSecure(`/books/email?email=${user.email}`)
            .then(response => {
                setMyBooks(response.data);
                setMyBooksLoading(false)
            }).catch(err => {
                console.log(err);
                setMyBooksLoading(false)
        })
    }, [user,axiosSecure])
    
    if (myBooksLoading) {
        return <Loading></Loading>
    }
    if (myBooks.length === 0) {
        return <NoBook></NoBook>
    }

    return (
        <div className="min-h-screen pt-36 mb-28 w-11/12 mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-8">
            My Books
          </h1>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {
                    myBooks.map(myBook=> <MyBook key={myBook._id} setMyBooks={setMyBooks} myBook={myBook}></MyBook> )
                }
            </div>
        </div>
    );
};

export default MyBooks;