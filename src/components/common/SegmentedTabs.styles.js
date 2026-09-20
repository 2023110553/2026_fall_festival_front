import styled from "styled-components";

export const TabList = styled.div`
  width: 100%;
  max-width: 343px;
  height: 40px;
  display: flex;
  overflow: hidden;
  border-radius: 999px;
  background: #FDFDFD;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
`;
export const Tab = styled.button`
  flex: ${({ $selected, $selectedWidth }) =>
    $selected && $selectedWidth ? `0 0 ${$selectedWidth}` : "1 1 0"};
  min-width: 0;
  height: 40px;
  padding: 5px 4px;
  border: 0;
  border-radius: ${({ $selected }) => ($selected ? "30px" : "0")};
  background: ${({ $selected }) => ($selected ? "#DC7054" : "#FDFDFD")};
  color: ${({ $selected }) => ($selected ? "#FDFDFD" : "#737373")};
  font-size: 14px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};  
  line-height: 1;
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: -2px;
  }
`;
