import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
import '../styles/chart.css';
import { getAllUserGender, getAllTeams } from '../api_config/api'
import {LabelContainer,LabelCard,CardHeadLine,ChartContainer} from './StyledLabel'
import TeamTable from './TeamTable'
export default class DoughnutCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            MaleCount: 0,
            FemaleCount: 0,
            memberCount:0,
            teamCount:0
        }
    }
    componentDidMount() {
        this.getAllUser()
        this.getTeams()
    }
    getAllUser(){
        getAllUserGender()
        .then((response) => {

            const Male = response.data.filter((Male) => {
                return Male.Gender === 'M'
            })
            const Female = response.data.filter((Female) => {
                return Female.Gender === 'F'
            })
            const MaleCount = Male.length
            const FemaleCount = Female.length
            this.setState({ MaleCount, FemaleCount });
        })
        .catch((error) => {
        })
    }
    getTeams(){
        getAllTeams()
        .then((response) => {
            const TeamData = response.data
            let memberCount = 0
            let leaderCount = 0
            const teamCount = TeamData.length
            TeamData.map((members)=>{
                if(members.Members.length>1){
                  return  memberCount  += members.Members.length
                }else return 0
            })
            TeamData.map((item)=>{
                if(item.Leader){
                  return  leaderCount  += 1
                }else return 0
            })
            this.setState({ memberCount,teamCount,leaderCount, TeamData});
        })
        .catch((error) => {
        })
    }

    render() {
        const { MaleCount, FemaleCount, memberCount,teamCount,TeamData} = this.state
        
        const genderData = {
            labels: [`عدد الذكور: ${MaleCount}`
                , `عدد الاناث: ${FemaleCount}`],
            datasets: [
                {
                    data: [MaleCount, FemaleCount],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 99, 132, 0.2)',

                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        return (
            <div>
                <div className="chartBar">
                    <div className="chartDiscretion">
                        احصائيات
                    </div>
                    <ChartContainer>
                        <div className="genderChart">
                            {MaleCount === 0 && FemaleCount === 0 ? <div class="spinner">Loading...</div> : 
                            <Doughnut data={genderData} />}
                        </div>
                        <LabelContainer>
                            <LabelCard white colorIs green={true} orangeLine={true}>
                                <CardHeadLine white>
                                    عدد الفرق التطوعية
                                </CardHeadLine>
                                <p>
                                {teamCount === 0  ?<div class="spinner">Loading...</div> :
                                    teamCount}
                                </p>
                            </LabelCard>
                        </LabelContainer>
                        <LabelContainer>
                            <LabelCard white colorIs read={true} blueLine={true}>
                                <CardHeadLine white>
                                    عدد المتطوعين
                                </CardHeadLine>
                                <p>
                                    { memberCount === 0 ?<div class="spinner">Loading...</div> :
                                    memberCount}
                                </p>
                            </LabelCard>
                        </LabelContainer>
                    </ChartContainer>
                </div>
                    <TeamTable data={TeamData} />
            </div>
        )
    }
}
