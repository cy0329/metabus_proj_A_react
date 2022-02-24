import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import 'css/pagination_userManage.css';
import '../../App.css';
import 'css/pagination_userManage.css';

function UserAssignList() {
  const [query, setQuery] = useState(null);
  const { auth } = useAuth();
  const { userId } = useParams();

  // 페이징
  const [, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 2;

  const [{ data: AssignStatusData, loading, error }, refetch] = useApiAxios(
    {
      url: `/adopt_assignment/api/assignment/`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const fetchNotices = useCallback(
    async (newPage, newQuery = query) => {
      const params = {
        page: newPage,
        query: newQuery,
      };
      const { data } = await refetch({ params });
      setPage(newPage);
      setPageCount(Math.ceil(data.count / itemsPerPage));
      setCurrentItems(data?.results);
    },
    [query],
  );

  useEffect(() => {
    fetchNotices(1);
  }, []);

  const handlePageClick = (event) => {
    fetchNotices(event.selected + 1);
  };

  // const getQuery = (e) => {
  //   setQuery(e.target.value);
  // };

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     fetchNotices(1, query);
  //   }
  // };

  return (
    <>
      <div className="header flex flex-wrap justify-center">
        <div className="userManage_header rounded-xl shadow-md overflow-hidden px-20 pt-5 pb-10 my-10 w-2/3">
          <blockquote class="mt-5 text-6xl mb-3 font-semibold italic text-center text-slate-900">
            <span class="mt-7 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-400 relative inline-block">
              <span class="relative text-white">" 회원관리 "</span>
            </span>
          </blockquote>

          {loading && '로딩 중 ...'}
          {error && '로딩 중 에러가 발생했습니다.'}

          <table className="border-2">
            <thead className="border-2">
              <tr>
                <th className="border-2">번호</th>
                <th className="border-2">등록번호</th>
                <th className="border-2">신청날짜</th>
                <th className="border-2">진행상태</th>
              </tr>
            </thead>
            <tbody>
              {AssignStatusData?.results.map((assign) => (
                <tr>
                  <td>
                    <Link to={`/admin/assignmanage/${assign.assignment_no}/`}>
                      {assign.assignment_no}
                    </Link>
                  </td>

                  <td>
                    <Link to={`/admin/animal/${assign.animal.animal_no}`}>
                      {assign.animal.animal_reg_num}
                    </Link>
                  </td>

                  <td>{assign.created_at}</td>

                  <td>
                    {assign.status === '신청' && '신청'}
                    {assign.status === '심사 중' && '심사 중'}
                    {assign.status === '수락' && '수락'}
                    {assign.status === '교육 중' && '교육 중'}
                    {assign.status === '입양 완료' && '입양 완료'}
                    {assign.status === '거절' && '거절'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel="<"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={itemsPerPage}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            className="pagination_userManage"
          />
        </div>
      </div>
    </>
  );
}

export default UserAssignList;
