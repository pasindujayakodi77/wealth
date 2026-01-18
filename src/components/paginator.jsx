import PropTypes from 'prop-types';

export default function Paginator(props){
    const { currentPage , totalPages, setCurrentPage , limit , setLimit , setLoading} = props // deconstructing a json

    
    return(
        <div className="w-full h-12.5 flex flex-row justify-center items-center gap-5">
            <select className="w-25 h-10 border border-gray-300 rounded-md p-2.5" value={currentPage} onChange={(e)=>{
                setLoading(true);
                setCurrentPage(parseInt(e.target.value));

            }}>
                {
                    Array.from({ length: totalPages }, (_, index) => (
                        <option key={index} value={index + 1}>
                            Page {index + 1}
                        </option>
                    ))
                }
            </select>
            <select className="w-25 h-10 border border-gray-300 rounded-md p-2.5" value={limit} onChange={(e)=>{
                setLoading(true);
                setLimit(parseInt(e.target.value));
            }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            <span className="text-gray-500">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    )
}

Paginator.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
    setLimit: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired
};