import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import DebugStates from 'DebugStates';
import useFieldValues from 'hooks/useFieldValues';
import { useEffect } from 'react';
import LoadingIndicator from 'LoadingIndicator';

const INIT_FIELD_VALUES = {
  title: '',
  content: '',
};

function InquiryForm({ inquiryId, handleDidSave }) {
  const { auth } = useAuth();

  const [{ data: inquiry, loading: getLoading, error: getError }] = useApiAxios(
    {
      url: `/inquiry_board/api/inquiry/${inquiryId}/`,
      method: 'GET',
    },
    {
      manual: !inquiryId,
    },
  );

  const [
    {
      loading: saveLoading,
      error: saveError,
      errorMessages: saveErrorMessages,
    },
    saveRequest,
  ] = useApiAxios(
    {
      url: !inquiryId
        ? '/inquiry_board/api/inquiry/'
        : `/inquiry_board/api/inquiry/${inquiryId}/`,
      method: !inquiryId ? 'POST' : 'PUT',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  INIT_FIELD_VALUES.user = auth.userID;

  const { fieldValues, handleFieldChange, setFieldValues } = useFieldValues(
    inquiry || INIT_FIELD_VALUES,
  );

  useEffect(() => {
    setFieldValues((prevFieldValues) => ({
      ...prevFieldValues,
    }));
  }, [inquiry]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(fieldValues).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        const fileList = value;
        fileList.forEach((file) => formData.append(name, file));
      } else {
        formData.append(name, value);
      }
    });
    saveRequest({
      data: formData,
    }).then((response) => {
      const savedPost = response.data;
      if (handleDidSave) handleDidSave(savedPost);
    });
  };

  return (
    <>
      <div className="header flex flex-wrap justify-center">
        <div className="notice_header rounded-md shadow-md overflow-hidden px-20 pt-5 pb-10 my-10 w-2/3">
          {/* 폼 작성 시작부분 */}
          <blockquote class="mt-3 mb-10 text-2xl font-semibold italic text-center text-slate-900">
            <span class="mt-7 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-400 relative inline-block text-6xl font-extrabold">
              <span class="relative text-white">" 내 문의사항 "</span>
            </span>
          </blockquote>
          <hr />
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="notice_header rounded-xl px-10 pt-6 pb-8"
            >
              {auth.isLoggedIn && !auth.is_staff && (
                <>
                  <div className="ml-3 mb-3 w-full">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block uppercase tracking-wide text-gray-700 text-m font-bold mb-2">
                      제목 입력
                    </span>
                    <input
                      name="title"
                      value={fieldValues.title}
                      onChange={handleFieldChange}
                      type="text"
                      placeholder="제목을 입력해주세요."
                      className="rounded-md text-sm  bg-gray-100 focus:bg-white focus:border-gray-400 w-full p-3 mb-6"
                    />
                    {saveErrorMessages.title?.map((message, index) => (
                      <p key={index} className="text-md text-red-400">
                        {message}
                      </p>
                    ))}
                  </div>

                  {/* 내용 입력 인풋박스 */}
                  <div className="ml-3 mb-3 w-full ">
                    <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block uppercase tracking-wide text-gray-700 text-m font-bold mb-2">
                      내용
                    </span>
                    <textarea
                      name="content"
                      value={fieldValues.content}
                      onChange={handleFieldChange}
                      placeholder="내용을 입력해주세요."
                      className="rounded-md text-sm  bg-gray-100 focus:bg-white focus:border-gray-400 w-full p-3 mb-6 h-60"
                    />
                    {saveErrorMessages.content?.map((message, index) => (
                      <p key={index} className="text-md text-red-400">
                        {message}
                      </p>
                    ))}
                  </div>
                </>
              )}
              {auth.isLoggedIn && auth.is_staff && inquiry && (
                <div className="ml-3 mb-3 w-full">
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block uppercase tracking-wide text-gray-700 text-m font-bold mb-2">
                    제목
                  </span>
                  <h1
                    className={
                      inquiry.title.length > 20
                        ? 'text-xl leading-6 font-bold text-gray-900 tracking-wide'
                        : 'text-3xl leading-6 font-bold text-gray-900 tracking-wide'
                    }
                  >
                    {inquiry.title}
                  </h1>
                  <hr className="mt-3 mb-3" />
                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-lg text-gray-500">
                    문의 내용
                  </h2>
                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-2xl text-gray-500">
                    {inquiry.content}
                  </h2>
                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-lg text-gray-500">
                    답변 입력
                  </h2>
                  <textarea
                    name="content"
                    value={fieldValues.content}
                    onChange={handleFieldChange}
                    placeholder="내용을 입력해주세요."
                    className="rounded-md text-sm  bg-gray-100 focus:bg-white focus:border-gray-400 w-full p-3 mb-6 h-60"
                  />
                  {saveErrorMessages.admin_answer?.map((message, index) => (
                    <p key={index} className="text-md text-red-400">
                      {message}
                    </p>
                  ))}
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  className=" bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  onClick={(e) => handleSubmit(e)}
                >
                  저장하기
                </button>
                <div className="p-5">
                  {saveLoading && (
                    <LoadingIndicator>저장 중...</LoadingIndicator>
                  )}
                  {saveError &&
                    `저장 중 에러가 발생했습니다. 메세지를 확인해주세요.`}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <DebugStates
        inquiry={inquiry}
        getLoading={getLoading}
        getError={getError}
        fieldValues={fieldValues}
      />
    </>
  );
}

export default InquiryForm;
