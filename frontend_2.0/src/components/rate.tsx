import * as React from 'react';
import { styled } from '@mui/material/styles';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = (style: React.CSSProperties): {
    [index: string]: {
        icon: React.ReactElement;
        label: string;
    }} => ({
        1: {
            icon: <SentimentVeryDissatisfiedIcon color="error" sx={{...style}}/>,
            label: 'Very Dissatisfied',
        },
        2: {
            icon: <SentimentDissatisfiedIcon color="error" sx={{...style}}/>,
            label: 'Dissatisfied',
        },
        3: {
            icon: <SentimentSatisfiedIcon color="warning" sx={{...style}}/>,
            label: 'Neutral',
        },
        4: {
            icon: <SentimentSatisfiedAltIcon color="success" sx={{...style}}/>,
            label: 'Satisfied',
        },
        5: {
            icon: <SentimentVerySatisfiedIcon color="success" sx={{...style}}/>,
            label: 'Very Satisfied',
        },
    }
);

const IconContainer = (style: React.CSSProperties) => function (props: IconContainerProps) {
    const { value, ...other} = props;
    return <span {...other}>{customIcons(style)[value].icon}</span>;
}

export default function Rate({...props}) {
    const {style, onChange, ...rest} = props;

    return (
        <StyledRating
            {...props}
            highlightSelectedOnly
            onChange={(event, value) => onChange(value)}
            IconContainerComponent={IconContainer(style)}
            getLabelText={(value: number) => customIcons(style)[value].label}
        />
    );
}