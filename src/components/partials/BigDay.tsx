import * as React from "react";
import "./BigDay.scss";

import { Containers } from "src/components/partials/structural/Containers";
import { analyticsSend } from "src/components/Helpers";
import { TimelineMock, TimelineItem } from "src/mocks/Timeline";

interface Props {

}

interface State {
    timeline: TimelineItem[];
}

export class BigDay extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            timeline: TimelineMock
        };
    }

    public componentDidMount(): void {
        analyticsSend("/p/big-day");
    }

    public render(): JSX.Element {
        return (
            <Containers
                extraClasses={"container__big-day"}
            >
                <div className={"container__row"}>
                    <div className={"column column--flex-2"}>

                        {this.state.timeline.map(item => (
                            <div className={"timeline"} key={item.id}>
                                <div className={"timeline__time"}>
                                    <h3>{item.time}</h3>
                                </div>
                                <div className={"timeline__information"}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </Containers>
        );
    }
}