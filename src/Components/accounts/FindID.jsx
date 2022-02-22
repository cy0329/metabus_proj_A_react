// import { useNavigate } from 'react-router-dom';
import { useApiAxios } from 'api/base';
import { useEffect, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import useFieldValues from 'hooks/useFieldValues';
import '../../App.css';
import './accounts.css';

const INITIAL_FIELD_VALUES = { name: '', email: '' };

function FindId() {
  const [findUser, setFindUser] = useState({});

  const { fieldValues, handleFieldChange } =
    useFieldValues(INITIAL_FIELD_VALUES);

  const [{ data: userList, loading, error }, refetch] = useApiAxios(
    {
      url: `/accounts/api/users/?query=${findUser.name}`,
      method: 'GET',
      data: { name: findUser.name, email: findUser.email },
    },
    { manual: true },
  );

  useEffect(() => {
    refetch();
  }, [findUser]);

  //   const getQuery = (e) => {
  //     setQuery(e.target.value);
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="header rounded-xl px-20 pt-6 pb-8 mb-4">
        <h2 className="text-center text-4xl py-5 pb-5 font-bold  mb-3">
          {' '}
          🐹 아이디 찾기{' '}
        </h2>
        <span className="text-center block uppercase tracking-wide text-red-400 text-s font-bold mb-3">
          아이디를 찾기 위해서는 회원님의 이름과 이메일이 필요합니다 ❕
        </span>
        {error?.response?.status === 401 && (
          <div className="text-red-400">
            조회에 실패했습니다. 입력하신 정보를 다시 확인해주세요.
          </div>
        )}
        <div className="flex justify-center">
          <div className="accounts_header shadow-md  rounded-xl ">
            <div className="max-w-m">
              <form
                className="rounded-xl px-20 pt-6 mb-4"
                onSubmit={handleSubmit}
              >
                <span className="mt-5 after:content-['*'] after:ml-0.5 after:text-red-500  block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2">
                  사용자 이름{' '}
                </span>
                <span className=" block uppercase tracking-wide text-blue-700 text-xs font-bold mb-2">
                  : 회원가입 시 입력하신 이름을 입력해주세요.
                </span>
                <input
                  type="text"
                  name="name"
                  value={fieldValues.name}
                  onChange={handleFieldChange}
                  className="relative rounded p-3 text-xl mb-3 bg-gray-100 focus:outline-none focus:border focus:border-gray-400  px-3 md:mb-0"
                  placeholder="이름을 입력해주세요."
                />

                <span className="after:content-['*'] after:ml-0.5 after:text-red-500  mt-10 block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2">
                  사용자 이메일{' '}
                </span>
                <span className=" block uppercase tracking-wide text-blue-700 text-xs font-bold mb-2">
                  : 회원가입 시 입력하신 이메일을 입력해주세요.
                </span>
                <input
                  type="text"
                  name="email"
                  value={fieldValues.email}
                  onChange={handleFieldChange}
                  className="relative rounded p-3 text-xl mb-3 bg-gray-100 focus:outline-none focus:border focus:border-gray-400 px-3 md:mb-0"
                  placeholder="이메일을 입력해주세요."
                />
                <br />
                <div className="mt-10 text-center text-2xl mb-10">
                  <button
                    type="submit"
                    className="bg-yellow-400 shadow-md hover:bg-yellow-700 border-yellow-400 hover:border-yellow-700 text-xl border-4 text-white rounded font-bold"
                    onClick={() =>
                      setFindUser({
                        name: fieldValues.name,
                        email: fieldValues.email,
                      })
                    }
                  >
                    아이디 찾기
                  </button>
                </div>
              </form>
              <hr />
              <div className="text-center">
                {userList && (
                  <div className="w-full">
                    {userList
                      .filter(
                        (user) =>
                          user.name === findUser.name &&
                          user.email === findUser.email,
                      )
                      .map((user) => (
                        <>
                          <div className="mt-5 mb-5">
                            <span className="mb-2 block uppercase tracking-wide text-gray-700 text-m font-bold">
                              {user.name}님의 아이디는
                            </span>
                            <span className="bg-gray-100 text-xl text-gray-700  font-bold">
                              " {user.userID} " 입니다.
                            </span>
                            <div className="text-right mr-5 mt-5">
                              <a
                                href="/accounts/login/"
                                className=" text-right text-m hover:bg-blue-200 hover:text-white font-semibold"
                              >
                                <span class="h-3 w-3 text-gray-700">
                                  <span class=" animate-ping absolute inline-flex h-5 w-5 rounded-full bg-sky-400 opacity-75"></span>
                                  <span class="relative rounded-full h-3 w-3 bg-sky-500"></span>{' '}
                                  로그인하러 가기{' '}
                                </span>
                              </a>
                            </div>
                          </div>
                        </>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindId;