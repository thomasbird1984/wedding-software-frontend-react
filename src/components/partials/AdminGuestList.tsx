import * as React from "react";
import * as _ from "lodash";
import "./AdminGuestList.scss";

import { axiosInstance } from "src/components/Root";
import { User } from "src/types/interfaces";
import { GuestMock } from "src/mocks/Guests";
import { Containers } from "src/components/partials/structural/Containers";
import { analyticsSend } from "src/components/Helpers";
import { TextInputToggler } from "src/components/partials/TextInputToggler";
import { AdminGuestListFilters } from "src/components/partials/AdminGuestListFilters";

interface Props {

}

interface State {
    guests: User[];
    filterVal: any;
    filteredGuests: User[];
    coming: number | undefined;
    notComing: number | undefined;
    notResponded: number | undefined;
    totalGuests: number | undefined;
    rsvpTotal: number | undefined;
    rsvpTotalPersonal: number | undefined;
    rsvpTotalWebsite: number | undefined;
}

export class AdminGuestList extends React.Component<Props, State> {
    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            guests: [],
            filteredGuests: [],
            filterVal: "all",
            coming: undefined,
            notComing: undefined,
            notResponded: undefined,
            totalGuests: undefined,
            rsvpTotal: undefined,
            rsvpTotalPersonal: undefined,
            rsvpTotalWebsite: undefined,
        };
    }

    public componentDidMount(): void {
        this.refreshGuestList();
        analyticsSend("/admin/guest-list");
    }

    private refreshGuestList(): void {
        axiosInstance.get(`/guest-list`).then(response => {
            console.log("response", response.data);

            this.setState({
                guests: response.data.guests,
                filteredGuests: response.data.guests,
                totalGuests: response.data.guests.length,
                rsvpTotal: _.filter(response.data.guests, (user) => {
                    return user.rsvp !== null;
                }).length,
                rsvpTotalPersonal: _.filter(response.data.guests, (user) => {
                    return user.rsvp_source === "personal";
                }).length,
                rsvpTotalWebsite: _.filter(response.data.guests, (user) => {
                    return user.rsvp_source === "website";
                }).length,
                coming: _.filter(response.data.guests, (user) => {
                    return user.rsvp === "yes";
                }).length,
                notComing: _.filter(response.data.guests, (user) => {
                    return user.rsvp === "no";
                }).length,
                notResponded: _.filter(response.data.guests, (user) => {
                    return user.rsvp === null;
                }).length
            });
        });
    }

    public render(): JSX.Element {
        return (
            <Containers>
                <div className={"GuestList__wrapper"}>
                    <div className={"subheader"}>
                        <div className={"subheader__column"}>
                            <h2>Guest List</h2>
                        </div>
                        <div className={"subheader__column"}>
                            <AdminGuestListFilters
                                onFilterData={(key, val) => this.filterData(key, val)}
                                currentVal={this.state.filterVal}
                            />
                        </div>
                    </div>

                    <p>
                    {this.state.guests.length ? (
                        <span><b>{this.state.coming}</b> people are coming, <b>{this.state.notComing}</b> are not coming and <b>{this.state.notResponded}</b> haven't responded.</span>
                    ): (undefined)}

                    {this.state.guests.length ? (
                        <span><b> {this.state.rsvpTotal}</b> guests have rsvp, <b>{this.percent(this.state.rsvpTotalPersonal!, this.state.rsvpTotal!)}%</b> rsvp personally and <b>{this.percent(this.state.rsvpTotalWebsite!, this.state.rsvpTotal!)}%</b> rsvp from the website.</span>
                    ): (undefined)}
                    </p>

                    <div className={"GuestList"}>
                        <table>
                            <thead>
                                <tr className={"GuestList__item GuestList__item--header"}>
                                    <th className={"GuestList__item--column"}>ID:</th>
                                    <th className={"GuestList__item--column"}>Name:</th>
                                    <th className={"GuestList__item--column"}>City/State:</th>
                                    <th className={"GuestList__item--column"}>Email:</th>
                                    <th className={"GuestList__item--column"}>Phone:</th>
                                    <th className={"GuestList__item--column"}>Table:</th>
                                    <th className={"GuestList__item--column"}>Is coming?</th>
                                    <th className={"GuestList__item--column"}>Rsvp Source</th>
                                    <th className={"GuestList__item--column"}>+1?</th>
                                    <th className={"GuestList__item--column"}>+1 Name</th>
                                </tr>
                            </thead>
                            <tbody>
                            {!this.state.guests.length ? (
                                <tr className={"GuestList__item"}>
                                    <td colSpan={8}>No records</td>
                                </tr>
                            ): (undefined)}
                            {this.state.filteredGuests.map((guest, i) => (
                                <tr className={"GuestList__item"} key={i}>
                                    <td className={"GuestList__item--column"}>{i+1}</td>
                                    <td className={"GuestList__item--column"}>{guest.first_name} {guest.last_name}</td>
                                    <td className={"GuestList__item--column"}>{guest.city}/{guest.state}</td>
                                    <td className={"GuestList__item--column"}>{guest.email}</td>
                                    <td className={"GuestList__item--column"}>{guest.phone}</td>
                                    <td className={"GuestList__item--column"}>
                                        <TextInputToggler
                                            val={guest.table_number}
                                            identifier={"table_number"}
                                            onSubmit={(val) => {
                                                this.toggleRsvpInfo(guest.id, "table_number", val);
                                            }}
                                        />
                                    </td>
                                    <td
                                        className={"GuestList__item--column"}
                                        onClick={() => this.toggleRsvpInfo(guest.id, "rsvp", guest.rsvp)}
                                    >
                                        {guest.rsvp ? guest.rsvp : "Hasn't responded"}
                                    </td>
                                    <td
                                        className={"GuestList__item--column"}
                                        onClick={() => guest.rsvp && this.toggleRsvpInfo(guest.id, "rsvp_source", guest.rsvp_source)}
                                    >
                                        {guest.rsvp ? guest.rsvp_source : "Hasn't responded"}
                                    </td>
                                    <td
                                        className={"GuestList__item--column"}
                                        onClick={() => this.toggleRsvpInfo(guest.id, "plus_one", guest.plus_one)}
                                    >
                                        {guest.rsvp === "yes" && guest.plus_one !== null ? `${guest.plus_one}` : "Hasn't responded"}
                                    </td>
                                    <td className={"GuestList__item--column"}>
                                        <TextInputToggler
                                            val={guest.plus_one_name}
                                            identifier={"plus_one_name"}
                                            onSubmit={(val) => {
                                                this.toggleRsvpInfo(guest.id, "plus_one_name", val);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Containers>
        )
    }

    private filterData(column: any, val: any): void {
        let filteredData = [];

        if(column === "default") {
            filteredData = this.state.guests;
        } else {
            filteredData = _.filter(this.state.guests, (user) => {
                return user[column] === val;
            });
        }

        this.setState({
            filterVal: val,
            filteredGuests: filteredData,
        });
    }

    private percent(subtotal: number, total: number): number {
        return Math.round(Math.abs((subtotal / total) * 100));
    }

    private toggleRsvpInfo(
        userId: number,
        key: string,
        currentVal: any
    ): void {
        let newVal: any;

        if(key === "plus_one_name" || key === "table_number") {
            newVal = currentVal;
        } else if(key === "rsvp_source") {
            switch(currentVal) {
                case "website":
                    newVal = "personal";
                break;
                case "personal":
                    newVal = "website";
                break;
                default:
                    newVal = null;
                break;
            }
        } else {
            switch(currentVal) {
                case "yes":
                    newVal = "no";
                    break;
                case "no":
                    newVal = null;
                    break;
                default:
                    newVal = "yes";
                    break;
            }
        }

        const dataForRequest = {
            userId: userId,
            key: key,
            val: newVal
        };

        axiosInstance
            .post(`/admin-toggle-rsvp`, dataForRequest).then(response => {
            console.log("response", response.data);
            this.refreshGuestList();
        })
        .catch(error => console.log("Errors: ", error));
    }
}
