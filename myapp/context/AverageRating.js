export const AverageRating = (comments) => {
    if (!comments || comments.length === 0) return "0.0";
    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = total / comments.length;
    return averageRating.toFixed(1); // ปัดเศษทศนิยม 1 ตำแหน่ง
};
