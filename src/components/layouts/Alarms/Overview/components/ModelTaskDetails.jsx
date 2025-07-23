import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Tag from "components/Core/Tags/TagNDL";
import User from 'assets/user_new.svg?react';
import KpiCardsNDL from "components/Core/KPICards/KpiCardsNDL";
import StatusNDL from "components/Core/Status/StatusNDL";
import { useRecoilState } from "recoil";
import {  themeMode } from "recoilStore/atoms";

const ModelFaultDetails = forwardRef(({ onClose, info, props, tasksForEntity }, ref) => {
    const { t } = useTranslation();
    const [CurTheme] = useRecoilState(themeMode);

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <div className="flex items-center justify-between w-full">
                    <TypographyNDL variant="heading-02-xs" value={t("Report Status")} />
                </div>
            </ModalHeaderNDL>

            <ModalContentNDL>
                <div className="flex flex-col gap-4">
                <TypographyNDL variant="paragraph-xs" value={"Last 6 Months"} />
                <div className="flex items-center justify-between">
                    <TypographyNDL variant="heading-02-xs" value={info.name} />

                    {(() => {
                         
                        let statusName = "In Progress";
                        let statusColor = "#ffa057";

                            const allCompleted = tasksForEntity.every(task => task.taskStatus.status.toLowerCase() === "completed");
                            const anycompleted = tasksForEntity.every(task => task.taskStatus.status.toLowerCase() !== "completed");

                            if (allCompleted) {
                                statusName = "Completed";
                                statusColor = "#24a148";
                            } else if (anycompleted) {
                                 statusName = "Pending";
                                 statusColor = "#dc3e42";
                            }

                            return <StatusNDL lessHeight name={statusName} style={{ backgroundColor: statusColor, color: "#ffffff" }} />;
                        })()}
                </div>

                {tasksForEntity && tasksForEntity.length > 0 ? (
                        tasksForEntity.map((task, index) => {
                           
                            let statusColor = "neutral";
                            const taskStatus = task.taskStatus.status.toLowerCase();

                            if (taskStatus === "completed") {
                                statusColor = "success";
                            } else if (taskStatus === "assigned" || taskStatus === "planned") {
                                statusColor = "warning02-alt";
                            } else if (taskStatus === "not assigned") {
                                statusColor = "error";
                            }

                            return (
                                <KpiCardsNDL
                                    key={index || task.task_id}
                                    className="p-4"
                                    style={{ border: "1px solid #E5E5E5", borderRadius: "8px" }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className='pb-2'>
                                        <TypographyNDL
                                            variant="paragraph-xs"
                                            color="text-tertiary"
                                            value={`#${task.task_id}`}
                                        />
                                        </div>
                                        <TypographyNDL
                                            variant="paragraph-xs"
                                            color="text-tertiary"
                                            value={new Date(task.reported_date).toLocaleDateString("en-GB")}
                                        />
                                    </div>

                                    <TypographyNDL
                                        variant="label-02-s"
                                        color="text-primary"
                                        value={task.title}
                                    />

                                    <div className="flex gap-2 mt-2">
                                        <Tag
                                            name={task.action_recommended ? task.action_recommended : "-"}
                                            colorbg="neutral"
                                        />
                                        <Tag name={task.taskStatus.status} colorbg={statusColor} />
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <User stroke={CurTheme === 'dark' ? '#eeeeee' : '#202020'} style={{ width: "16px", height: "16px" }} />
                                        <TypographyNDL
                                            variant="paragraph-s"
                                            color="text-secondary"
                                            value={task.userByAssignedFor.name}
                                        />
                                    </div>
                                </KpiCardsNDL>
                            );
                        })
                    ) : (
                        <TypographyNDL variant="label-01-s" color="secondary" value="No tasks available" />
                    )}
                </div>
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button
                    value={t('Close')}
                    type="secondary"
                    style={{ marginTop: 10, marginBottom: 10 }}
                    onClick={onClose}
                />
            </ModalFooterNDL>
        </React.Fragment>
    );
});

export default ModelFaultDetails;
