import styled from "@emotion/styled";
import { Check } from "@mui/icons-material";
import { StepConnector, stepConnectorClasses, StepIconProps } from "@mui/material";
import { THEME } from "../constants";

export const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        color: THEME.BUTTON_ACCENT,
        top: 10,
        left: 'calc(-50% + 22px)',
        right: 'calc(50% + 22px)',
    },
        [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: THEME.ACTIVE_ACCENT,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
            borderColor: THEME.ACTIVE_ACCENT,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        color: THEME.BUTTON_ACCENT,
        borderColor: THEME.BUTTON_ACCENT,
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
        color: THEME.BUTTON_ACCENT,
        display: 'flex',
        height: 22,
        alignItems: 'center',
        ...(ownerState.active && {
            color: THEME.ACTIVE_ACCENT,
        }),
        '& .QontoStepIcon-completedIcon': {
            color: THEME.ACTIVE_ACCENT,
            zIndex: 1,
            fontSize: 24,
        },
        '& .QontoStepIcon-circle': {
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
    }),
);

export function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}