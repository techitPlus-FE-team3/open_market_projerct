import FunctionalButton from "@/components/FunctionalButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import Textarea from "@/components/Textarea";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { currentUserState } from "@/states/authState";
import { codeState } from "@/states/categoryState";
import { Common } from "@/styles/common";
import { axiosInstance, numberWithComma } from "@/utils";
import styled from "@emotion/styled";
import CircleIcon from "@mui/icons-material/Circle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Radio, RadioProps } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

interface FlexLayoutProps {
	right?: boolean;
}

interface StyleProps {
	wide?: boolean;
	large?: boolean;
}

interface LabelProps {
	bar?: boolean;
	large?: boolean;
}

const ProductManagementSection = styled.section`
	background-color: ${Common.colors.white};
	width: 1440px;
	margin: 0 auto;
	padding-top: 100px;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.ProductInfoWrapper {
		background-color: ${Common.colors.gray2};
		padding: 40px;
		width: 1328px;
		margin: 0 auto;
		margin-bottom: 20px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		position: relative;
		gap: ${Common.space.spacingXl};
	}
	.ProductImage {
		border-radius: 10px;
		width: 300px;
	}
	.ProductInfo {
		background-color: ${Common.colors.white};
	}
`;

const FormTopLayout = styled.div`
	width: 1248px;
	display: flex;
	gap: ${Common.space.spacingLg};
`;

const FormTopRightLayout = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${Common.space.spacingLg};
	width: 918px;
`;
const ProductItemWrapper = styled.div<StyleProps>`
	display: flex;
	position: relative;
	border-radius: 10px;
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingLg} ${Common.space.spacingMd};
	${(props) => (props.wide ? "width: 677px;" : "flex-grow: 1;")}

	${(props) =>
		props.large ? `height: 290px;` : "height: 72px; 	align-items: center;"}
`;

const ProductLabel = styled.span<LabelProps>`
	color: ${Common.colors.gray};
	white-space: nowrap;

	${(props) =>
		props.bar &&
		`
    &:after {
      content: " | ";
    }
  `}
`;

const ProductValue = styled.span<LabelProps>`
	font-size: 16px;
	color: ${Common.colors.black};
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingLg};
	${(props) =>
		props.large &&
		`
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: ${Common.font.size.xl};
    color:${Common.colors.gray}
  `}
`;

const FlexLayout = styled.div<FlexLayoutProps>`
	display: flex;
	gap: ${Common.space.spacingXl};
	${(props) => props.right && "justify-content: flex-end;"}
`;

const ProductRadioButtonWrapper = styled.div`
	width: 590px;
	height: 290px;
	color: ${Common.colors.gray};
	border-radius: 10px;
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingMd};
`;

const RadioButtonGroup = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 50%;
	transform: translateY(-60%);
`;

const StyledRadio = muiStyled((props: RadioProps) => (
	<Radio
		{...props}
		icon={<RadioButtonUncheckedIcon style={{ color: "#D9D9D9" }} />}
		checkedIcon={<CircleIcon style={{ color: "#FFB258" }} />}
	/>
))``;

const LinkedEditButton = styled(Link)`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 200px;
	height: 80px;
	border-radius: 10px;
	font-size: ${Common.font.size.xl};
	background-color: ${Common.colors.emphasize};
	text-decoration: none;
	color: ${Common.colors.white};
`;

const ProductDetailLink = styled(Link)`
	width: auto;
	height: auto;
	padding: 8px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	position: absolute;
	right: ${Common.space.spacingLg};
	font-size: ${Common.font.size.sm};
	color: ${Common.colors.black};
	text-decoration: none;
	background-color: ${Common.colors.emphasize};
	border-radius: 10px;
`;

const UserProductListLink = styled(Link)`
	position: absolute;
	top: 12px;
	text-decoration: none;
	color: rgb(40, 40, 44, 0.7);
`;

function ProductManage() {
	const navigate = useNavigate();

	const { productId } = useParams();

	const currentUser = useRecoilValue(currentUserState);
	const category = useRecoilValue(codeState);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [userProductInfo, setUserProductInfo] = useState<Product>();
	const [genre, setGenre] = useState<string>();

	useRequireAuth();

	function handleProductDelete(e: { preventDefault: () => void }) {
		e.preventDefault();
		const result = confirm("상품을 정말로 삭제하시겠습니까?");
		if (!result) return;
		try {
			axiosInstance
				.delete(`/seller/products/${productId}`)
				.then(() => {
					toast.success("상품 삭제 완료", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					navigate(`/user/${currentUser?._id}/products`);
				})
				.catch((error) => {
					console.error("에러 발생:", error);
				});
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const fetchUserProductInfo = async () => {
			try {
				const response = await axiosInstance.get<ProductResponse>(
					`/seller/products/${productId}`,
				);
				setUserProductInfo(response.data.item);
			} catch (error) {
				if (error instanceof AxiosError && error.response?.status === 404) {
					return navigate("/err404", { replace: true });
				}
				console.error("상품 정보 조회 실패:", error);
			}
		};

		fetchUserProductInfo();
	}, []);

	useEffect(() => {
		if (userProductInfo) {
			setIsLoading(false);
		}
	}, [userProductInfo]);

	useEffect(() => {
		function translateCodeToValue(code: string) {
			if (
				code !== undefined &&
				category !== undefined &&
				userProductInfo !== undefined
			) {
				return category!.find((item) => item.code === code)?.value;
			}
		}
		setGenre(translateCodeToValue(userProductInfo?.extra?.category!));
	}, [userProductInfo, category]);

	if (isLoading) {
		return <LoadingSpinner width="100vw" height="100vh" />;
	}

	return (
		<ProductManagementSection>
			<Helmet>
				<title>Management Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2 className="a11yHidden">상품 관리</h2>
			<div className="ProductInfoWrapper">
				<UserProductListLink to={`/user/${currentUser!._id}/products`}>
					&gt; 판매 상품 목록
				</UserProductListLink>
				<FormTopLayout>
					<img
						src={userProductInfo?.mainImages[0].path}
						alt={`${userProductInfo?.name} 앨범 아트`}
						className="ProductImage"
					/>
					<FormTopRightLayout>
						<ProductItemWrapper>
							<ProductLabel bar>제목</ProductLabel>
							<ProductValue>{userProductInfo?.name}</ProductValue>
							{userProductInfo?.show ? (
								<ProductDetailLink
									to={`/productdetail/${userProductInfo?._id}`}
								>
									상세 페이지 확인
								</ProductDetailLink>
							) : (
								<></>
							)}
						</ProductItemWrapper>
						<FlexLayout>
							<ProductItemWrapper>
								<ProductLabel bar>장르</ProductLabel>
								<ProductValue>{genre}</ProductValue>
							</ProductItemWrapper>
							<ProductItemWrapper wide>
								<ProductLabel bar>해시태그</ProductLabel>
								<ProductValue>
									{userProductInfo?.extra?.tags?.map((i) => `#${i} `)}
								</ProductValue>
							</ProductItemWrapper>
						</FlexLayout>
						<Textarea readOnly={true} content={userProductInfo?.content} />
					</FormTopRightLayout>
				</FormTopLayout>
				<FlexLayout>
					<ProductItemWrapper large>
						<ProductLabel>
							판매 수익 (판매 가격:
							<span> {numberWithComma(userProductInfo?.price!)}₩</span>)
						</ProductLabel>

						<ProductValue large>
							{typeof userProductInfo?.buyQuantity !== "undefined"
								? numberWithComma(
										userProductInfo?.buyQuantity * userProductInfo?.price,
									)
								: "0"}
							₩
						</ProductValue>
					</ProductItemWrapper>
					<ProductRadioButtonWrapper>
						<span>공개여부</span>
						<RadioButtonGroup>
							<span>공개</span>
							<StyledRadio
								checked={userProductInfo?.show === true}
								value="true"
							/>
							<div>
								<span>비공개</span>
								<StyledRadio
									checked={userProductInfo?.show === false}
									value="false"
								/>
							</div>
						</RadioButtonGroup>
					</ProductRadioButtonWrapper>
				</FlexLayout>
				<FlexLayout right>
					<FunctionalButton
						secondary
						type="submit"
						handleFn={handleProductDelete}
						text="삭제"
					/>
					<LinkedEditButton
						to={`/productedit/${userProductInfo?._id}`}
						title="수정하러 가기"
					>
						수정
					</LinkedEditButton>
				</FlexLayout>
			</div>
		</ProductManagementSection>
	);
}

export default ProductManage;
