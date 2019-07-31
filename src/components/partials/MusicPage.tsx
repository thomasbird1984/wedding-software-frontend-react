import * as React from "react";
import { Containers } from "src/components/partials/structural/Containers";
import { analyticsSend, isTruthy } from "src/components/Helpers";
import { axiosInstance } from "src/components/Root";

interface Props {

}

interface State {
    artist: string;
    song: string;
    isErrors: boolean;
    isSubmitted: boolean;
}

export class MusicPage extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            artist: "",
            song: "",
            isErrors: false,
            isSubmitted: false
        };
    }

    public componentDidMount(): void {
        analyticsSend("/p/music");
    }

    public render(): JSX.Element {
        return (
            <Containers
                extraClasses={"container__music"}
            >
                <div className={"container__row"}>
                    <div className={"MusicPage__map column"}>

                        <h2>Music Request</h2>

                        <p>Have a favorite song, have a song that reminds you of some memory with us, request it hear. We'll do our best to make sure that the dj gets all requested songs but can't make any guarantees it'll be played.</p>

                        <form onSubmit={(e) => this.submit(e)}>
                            <div className={"container__row"}>
                                <div className={"FormGroup"}>
                                    <label className={"FormGroup__label"} htmlFor={"name"}>Artist</label>
                                    <input
                                        className={"FormGroup__input"}
                                        type={"text"}
                                        name={"artist"}
                                        id={"artist"}
                                        value={this.state.artist}
                                        placeholder={"Enter your artist..."}
                                        onChange={(e) => this.setState({ artist: e.target.value })}
                                    />
                                </div>

                                <div className={"FormGroup"}>
                                    <label className={"FormGroup__label"} htmlFor={"song"}>Song:</label>
                                    <input
                                        className={"FormGroup__input"}
                                        type={"text"}
                                        name={"song"}
                                        id={"song"}
                                        value={this.state.song}
                                        placeholder={"Enter song..."}
                                        onChange={(e) => this.setState({ song: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type={"submit"} className={"btn btn__primary"}>Request Song</button>
                        </form>
                    </div>
                </div>
            </Containers>
        );
    }

    private submit(e: any): void {
        this.setState({ isErrors: false });
        if(isTruthy(this.state.artist) && isTruthy(this.state.song)) {
            const dataForRequest = {
                artist: this.state.artist,
                song: this.state.song
            };

            axiosInstance
                .post(`/rsvp-respond`, dataForRequest).then(response => {
                console.log("response", response.data);
                this.setState({ isSubmitted: true });
            });
        } else {
            this.setState({ isErrors: true });
        }
        e.preventDefault();
    }
}
