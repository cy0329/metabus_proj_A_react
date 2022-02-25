import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import 'css/pagination_userManage.css';
import '../../App.css';
import './userManage.css';

function UserAssignList() {
  const [query, setQuery] = useState(null);
  const { auth } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="header flex flex-wrap justify-center">
        <div className="notice_header rounded-xl shadow-md overflow-hidden px-20 pt-5 pb-10 my-10 w-2/3">
          <blockquote className="mt-5 text-6xl mb-3 font-semibold italic text-center text-slate-900">
            <span className="mt-7 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-400 relative inline-block">
              <span className="relative text-white">" 입양신청 현황 "</span>
            </span>
          </blockquote>

          {loading && '로딩 중 ...'}
          {error && '로딩 중 에러가 발생했습니다.'}

          <div className="mb-5">
            <table className="mb-5 mt-10 border text-center min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-1/4">
                    번호
                  </th>
                  <th className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-1/4">
                    등록번호
                  </th>
                  <th className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-1/4">
                    신청날짜
                  </th>
                  <th className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider w-1/4">
                    진행상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {AssignStatusData?.results.map((assign) => (
                  <tr>
                    <td className="py-4">
                      <div
                        className="text-xl font-medium text-gray-900"
                        onClick={() =>
                          navigate(
                            `/admin/assignmanage/${assign.assignment_no}/`,
                          )
                        }
                      >
                        {assign.assignment_no}
                      </div>
                    </td>

                    <td className="py-4">
                      <div
                        className="text-lg font-medium text-gray-900 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/animal/${assign.animal.animal_no}/`)
                        }
                      >
                        {assign.animal.animal_reg_num}
                      </div>
                    </td>

                    <td className="text-lg py-4">{assign.created_at}</td>

                    <td className="text-lg py-4">{assign.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
