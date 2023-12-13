import React from "react";
import { Link } from "react-router-dom";

interface MyPageListProps {
	title: string;
	data: any[];
	renderItem: (item: any) => JSX.Element;
	linkText?: string;
	linkUrl?: string;
}

const MyPageList = ({
	title,
	data,
	renderItem,
	linkText,
	linkUrl,
}: MyPageListProps) => {
	return (
		<article>
			<h3>{title}</h3>
			<ul>
				{data.length !== 0 ? (
					data.map((item) => <li key={item._id}>{renderItem(item)}</li>)
				) : (
					<span>목록이 없습니다.</span>
				)}
			</ul>
			{linkText && linkUrl && <Link to={linkUrl}>{linkText}</Link>}
		</article>
	);
};

export default MyPageList;
